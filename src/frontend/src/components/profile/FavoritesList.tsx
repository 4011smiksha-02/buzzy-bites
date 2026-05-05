import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/types";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Star, Utensils } from "lucide-react";

// Favorites are stored in localStorage since the backend doesn't have a favorites endpoint yet.
// Key: "buzzy_favorites" → comma-separated restaurant IDs
export function useFavorites() {
  const getIds = (): string[] => {
    try {
      const raw = localStorage.getItem("buzzy_favorites");
      return raw ? raw.split(",").filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const unfavorite = (id: string) => {
    const ids = getIds().filter((x) => x !== id);
    localStorage.setItem("buzzy_favorites", ids.join(","));
    window.dispatchEvent(new Event("buzzy_favorites_change"));
  };

  return { getIds, unfavorite };
}

interface FavoriteCardProps {
  restaurant: Restaurant;
  index: number;
  onUnfavorite: (id: string) => void;
}

function FavoriteCard({ restaurant, index, onUnfavorite }: FavoriteCardProps) {
  return (
    <div
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-warm transition-smooth"
      data-ocid={`favorites.item.${index}`}
    >
      {/* Image */}
      <Link
        to="/restaurants/$id"
        params={{ id: restaurant.id.toString() }}
        data-ocid={`favorites.restaurant_link.${index}`}
      >
        <div className="relative h-44 overflow-hidden bg-muted">
          <img
            src={restaurant.coverImage || "/assets/images/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display font-bold text-white text-lg leading-tight truncate">
              {restaurant.name}
            </h3>
            <p className="text-white/80 font-body text-sm">
              {restaurant.cuisine}
            </p>
          </div>
        </div>
      </Link>

      {/* Meta */}
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center gap-1 text-sm font-body text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-body text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            {(restaurant.rating ?? 0).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="font-body text-xs">
            {restaurant.priceRange}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-destructive hover:bg-destructive/10 transition-smooth"
            onClick={() => onUnfavorite(restaurant.id.toString())}
            aria-label={`Remove ${restaurant.name} from favorites`}
            data-ocid={`favorites.delete_button.${index}`}
          >
            <Heart className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FavoritesListProps {
  restaurants: Restaurant[];
  favoriteIds: string[];
  onUnfavorite: (id: string) => void;
}

export function FavoritesList({
  restaurants,
  favoriteIds,
  onUnfavorite,
}: FavoritesListProps) {
  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteIds.includes(r.id.toString()),
  );

  if (favoriteRestaurants.length === 0) {
    return (
      <div
        className="flex flex-col items-center py-16 text-center"
        data-ocid="favorites.empty_state"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Utensils className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No favourites yet
        </h3>
        <p className="font-body text-muted-foreground text-sm max-w-xs">
          Heart a restaurant while browsing to save it here for quick access.
        </p>
        <Link to="/">
          <Button
            className="mt-6 font-body"
            data-ocid="favorites.explore_button"
          >
            Discover restaurants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteRestaurants.map((restaurant, i) => (
        <FavoriteCard
          key={restaurant.id.toString()}
          restaurant={restaurant}
          index={i + 1}
          onUnfavorite={onUnfavorite}
        />
      ))}
    </div>
  );
}
