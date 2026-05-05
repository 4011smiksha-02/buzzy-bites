import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/types";
import { Leaf, Wheat } from "lucide-react";

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
}

function DietBadge({ item }: { item: MenuItem }) {
  return (
    <span className="flex gap-1.5">
      {item.isVegan && (
        <span title="Vegan" className="text-accent">
          <Leaf className="w-3.5 h-3.5" />
        </span>
      )}
      {item.isVegetarian && !item.isVegan && (
        <span title="Vegetarian" className="text-accent">
          <Leaf className="w-3.5 h-3.5 opacity-70" />
        </span>
      )}
      {item.isGlutenFree && (
        <span title="Gluten-free" className="text-muted-foreground">
          <Wheat className="w-3.5 h-3.5" />
        </span>
      )}
    </span>
  );
}

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <div
      data-ocid={`menu.item.${index}`}
      className="flex gap-4 py-4 border-b border-border last:border-0 group"
    >
      {item.imageUrl && (
        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-display font-semibold text-foreground text-sm truncate">
              {item.name}
            </span>
            <DietBadge item={item} />
            {!item.isAvailable && (
              <Badge variant="secondary" className="text-xs">
                Unavailable
              </Badge>
            )}
          </div>
          <span className="shrink-0 font-semibold text-primary text-sm">
            £{(item.price ?? 0).toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function MenuSection({ category, items }: MenuSectionProps) {
  return (
    <div data-ocid={`menu.section.${category.toLowerCase()}`} className="mb-8">
      <h3 className="font-display text-lg font-bold text-foreground capitalize mb-2 pb-2 border-b-2 border-primary/20">
        {category}
      </h3>
      <div>
        {items.map((item, i) => (
          <MenuItemCard key={item.id.toString()} item={item} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
