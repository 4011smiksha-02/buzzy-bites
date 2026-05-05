import { Badge } from "@/components/ui/badge";
import type { Restaurant } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { motion } from "motion/react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

const PRICE_COLORS: Record<string, string> = {
  $: "text-accent",
  $$: "text-accent",
  $$$: "text-primary",
  $$$$: "text-primary",
};

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const priceColor =
    PRICE_COLORS[restaurant.priceRange] ?? "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      className="group"
    >
      <Link
        to="/restaurants/$id"
        params={{ id: restaurant.id.toString() }}
        className="block rounded-xl overflow-hidden bg-card border border-border shadow-warm hover:shadow-md transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        data-ocid={`restaurant.item.${index + 1}`}
      >
        {/* Cover image */}
        <div className="relative h-52 overflow-hidden">
          {restaurant.coverImage ? (
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center">
              <span className="font-display text-2xl text-primary/60 font-semibold">
                {restaurant.name.slice(0, 2)}
              </span>
            </div>
          )}
          {/* Reserve badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent/90 hover:bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full shadow">
              Reserve
            </Badge>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight truncate">
            {restaurant.name}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-muted-foreground">
              {restaurant.cuisine}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium text-primary">
                {(restaurant.rating ?? 0).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {restaurant.location}
              </span>
            </div>
            <span className={`text-sm font-semibold ${priceColor}`}>
              {restaurant.priceRange}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
