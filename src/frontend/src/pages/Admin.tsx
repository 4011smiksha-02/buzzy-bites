// Placeholder — will be implemented in the next wave
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { AdminTab } from "@/components/admin/AdminSidebar";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { MenuManager } from "@/components/admin/MenuManager";
import { ReservationDetail } from "@/components/admin/ReservationDetail";
import { ReservationList } from "@/components/admin/ReservationList";
import { RestaurantSettings } from "@/components/admin/RestaurantSettings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useAdminReservations } from "@/hooks/use-reservations";
import {
  useAdminRestaurant,
  useGalleryImages,
  useMenuItems,
} from "@/hooks/use-restaurants";
import type { GalleryImage, MenuItem, Reservation } from "@/types";
import { CalendarDays, CheckCircle2, Clock, Menu, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.FC<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-warm">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground font-body">{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({ reservations }: { reservations: Reservation[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .slice(0, 10);

  const todayBookings = useMemo(
    () => reservations.filter((r) => r.date === today),
    [reservations, today],
  );
  const upcoming = useMemo(
    () =>
      reservations
        .filter((r) => r.date >= today && r.date <= weekEnd)
        .sort((a, b) => (`${a.date}${a.time}` < `${b.date}${b.time}` ? -1 : 1))
        .slice(0, 5),
    [reservations, today, weekEnd],
  );
  const confirmed = useMemo(
    () => reservations.filter((r) => r.status.__kind__ === "Confirmed").length,
    [reservations],
  );
  const pending = useMemo(
    () => reservations.filter((r) => r.status.__kind__ === "Pending").length,
    [reservations],
  );
  const cancelled = useMemo(
    () => reservations.filter((r) => r.status.__kind__ === "Cancelled").length,
    [reservations],
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's bookings"
          value={todayBookings.length}
          icon={CalendarDays}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Confirmed total"
          value={confirmed}
          icon={CheckCircle2}
          color="bg-accent/10 text-accent"
        />
        <StatCard
          label="Pending"
          value={pending}
          icon={Clock}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Cancelled"
          value={cancelled}
          icon={XCircle}
          color="bg-destructive/10 text-destructive"
        />
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">
            Upcoming this week
          </h3>
        </div>
        {upcoming.length === 0 ? (
          <div
            data-ocid="overview.upcoming.empty_state"
            className="px-5 py-8 text-center text-sm text-muted-foreground"
          >
            No upcoming reservations this week.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {upcoming.map((r, i) => (
              <div
                key={r.id.toString()}
                data-ocid={`overview.upcoming.item.${i + 1}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-smooth"
              >
                <div>
                  <p className="font-body font-medium text-foreground text-sm">
                    {r.guestName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.date} · {r.time} · {r.partySize.toString()} guests
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    r.status.__kind__ === "Confirmed"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : r.status.__kind__ === "Pending"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {r.status.__kind__}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const { data: restaurant, isLoading: restaurantLoading } =
    useAdminRestaurant();
  const restaurantId = restaurant?.id ?? null;

  const { data: reservations = [], isLoading: reservationsLoading } =
    useAdminReservations(restaurantId);
  const { data: menuItems = [], isLoading: menuLoading } =
    useMenuItems(restaurantId);
  const { data: galleryImages = [], isLoading: galleryLoading } =
    useGalleryImages(restaurantId);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Skeleton className="h-16 w-48 rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="admin.login_prompt"
        className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8 text-primary"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-labelledby="lock-title"
            role="img"
          >
            <title id="lock-title">Lock icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Restaurant Admin
          </h2>
          <p className="text-muted-foreground font-body max-w-xs">
            Sign in with Internet Identity to manage your restaurant listing.
          </p>
        </div>
        <Button
          data-ocid="admin.login_button"
          onClick={login}
          className="bg-primary text-primary-foreground px-8"
        >
          Sign in with Internet Identity
        </Button>
      </div>
    );
  }

  if (restaurantLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div
        data-ocid="admin.setup_panel"
        className="container mx-auto px-4 py-12 max-w-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Create Your Restaurant
          </h2>
          <p className="text-muted-foreground font-body">
            Set up your listing to start accepting reservations on Buzzy Bites.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-warm">
          <RestaurantSettings
            restaurant={null}
            availability={null}
            isCreate
            onCreated={() => setTab("overview")}
          />
        </div>
      </div>
    );
  }

  const TAB_TITLES: Record<AdminTab, string> = {
    overview: "Overview",
    reservations: "Reservations",
    menu: "Menu",
    gallery: "Gallery",
    settings: "Settings",
  };

  return (
    <div
      data-ocid="admin.page"
      className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background"
    >
      <AdminSidebar
        activeTab={tab}
        onTabChange={setTab}
        restaurantName={restaurant.name}
        onLogout={() => {}}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <button
            type="button"
            data-ocid="admin.sidebar_toggle"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">
            {TAB_TITLES[tab]}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {tab === "overview" && (
            <OverviewTab reservations={reservations as Reservation[]} />
          )}
          {tab === "reservations" && (
            <ReservationList
              reservations={reservations as Reservation[]}
              isLoading={reservationsLoading}
              onSelect={setSelectedReservation}
            />
          )}
          {tab === "menu" && restaurantId && (
            <MenuManager
              restaurantId={restaurantId}
              items={menuItems as MenuItem[]}
              isLoading={menuLoading}
            />
          )}
          {tab === "gallery" && restaurantId && (
            <GalleryManager
              restaurantId={restaurantId}
              images={galleryImages as GalleryImage[]}
              isLoading={galleryLoading}
            />
          )}
          {tab === "settings" && (
            <RestaurantSettings restaurant={restaurant} availability={null} />
          )}
        </main>
      </div>
      <ReservationDetail
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}
