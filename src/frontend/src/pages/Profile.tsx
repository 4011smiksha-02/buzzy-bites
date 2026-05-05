import {
  FavoritesList,
  useFavorites,
} from "@/components/profile/FavoritesList";
import { ReservationHistory } from "@/components/profile/ReservationHistory";
// Placeholder — will be implemented in the next wave
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useRestaurants } from "@/hooks/use-restaurants";
import { Link } from "@tanstack/react-router";
import {
  BookMarked,
  Heart,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function ProfileHeader({
  principal,
  onLogout,
}: {
  principal: string | null;
  onLogout: () => void;
}) {
  const joined = new Date().getFullYear();

  return (
    <div className="bg-card border-b border-border" data-ocid="profile.header">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center shrink-0">
            <User className="h-9 w-9 text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-bold text-foreground truncate">
                My Account
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-body font-medium">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            </div>
            <p
              className="font-mono text-xs text-muted-foreground truncate"
              data-ocid="profile.principal"
            >
              {principal}
            </p>
            <p className="text-sm font-body text-muted-foreground mt-1">
              Member since {joined}
            </p>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="shrink-0 font-body gap-2 text-muted-foreground hover:text-foreground"
            data-ocid="profile.logout_button"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { isAuthenticated, isLoading, principal, login, logout } = useAuth();
  const { data: restaurants } = useRestaurants();
  const { getIds, unfavorite } = useFavorites();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getIds());

  const syncFavorites = useCallback(() => setFavoriteIds(getIds()), [getIds]);

  useEffect(() => {
    window.addEventListener("buzzy_favorites_change", syncFavorites);
    return () =>
      window.removeEventListener("buzzy_favorites_change", syncFavorites);
  }, [syncFavorites]);

  const handleUnfavorite = (id: string) => {
    unfavorite(id);
    setFavoriteIds((prev) => prev.filter((x) => x !== id));
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-16 flex flex-col items-center gap-4"
        data-ocid="profile.loading_state"
      >
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  // Unauthenticated gate
  if (!isAuthenticated) {
    return (
      <div
        className="flex-1 flex items-center justify-center min-h-[70vh]"
        data-ocid="profile.auth_gate"
      >
        <div className="max-w-sm w-full mx-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-9 w-9 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Sign in to view your profile
          </h2>
          <p className="font-body text-muted-foreground text-sm mb-8">
            Access your reservation history, saved favourites, and account
            settings after signing in.
          </p>
          <Button
            onClick={() => login()}
            size="lg"
            className="w-full font-body font-medium"
            data-ocid="profile.login_button"
          >
            Sign in with Internet Identity
          </Button>
          <Link to="/">
            <Button
              variant="ghost"
              className="mt-3 w-full font-body"
              data-ocid="profile.back_button"
            >
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="profile.page">
      <ProfileHeader principal={principal} onLogout={logout} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="mb-6 bg-muted/50" data-ocid="profile.tabs">
            <TabsTrigger
              value="reservations"
              className="font-body gap-2"
              data-ocid="profile.reservations_tab"
            >
              <BookMarked className="h-4 w-4" />
              My Reservations
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="font-body gap-2"
              data-ocid="profile.favorites_tab"
            >
              <Heart className="h-4 w-4" />
              Favourites
              {favoriteIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/15 text-primary font-medium">
                  {favoriteIds.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="mt-0">
            <ReservationHistory />
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <FavoritesList
              restaurants={restaurants ?? []}
              favoriteIds={favoriteIds}
              onUnfavorite={handleUnfavorite}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
