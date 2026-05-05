import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CuisineType, PriceRange } from "@/types";
import { X } from "lucide-react";

const CUISINES: CuisineType[] = [
  "Italian",
  "Japanese",
  "French",
  "Modern European",
  "Indian",
  "Mediterranean",
  "American",
  "Thai",
];

const PRICE_RANGES: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

const NEIGHBORHOODS = [
  "Mayfair",
  "Soho",
  "Fitzrovia",
  "Notting Hill",
  "Shoreditch",
  "Chelsea",
  "Covent Garden",
  "Marylebone",
];

export interface FilterState {
  cuisines: string[];
  priceRanges: string[];
  neighborhoods: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const setCuisines = (v: string) =>
    onChange({ ...filters, cuisines: toggle(filters.cuisines, v) });
  const setPrices = (v: string) =>
    onChange({ ...filters, priceRanges: toggle(filters.priceRanges, v) });
  const setNeighborhoods = (v: string) =>
    onChange({ ...filters, neighborhoods: toggle(filters.neighborhoods, v) });

  const hasFilters =
    filters.cuisines.length +
      filters.priceRanges.length +
      filters.neighborhoods.length >
    0;

  return (
    <aside
      className="bg-card border border-border rounded-xl p-5 space-y-6 shadow-warm"
      data-ocid="filter.panel"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-foreground">
          Filters
        </h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive text-xs h-7 px-2"
            onClick={() =>
              onChange({ cuisines: [], priceRanges: [], neighborhoods: [] })
            }
            data-ocid="filter.clear_button"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Cuisine */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Cuisine
        </p>
        <div className="space-y-2">
          {CUISINES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox
                id={`cuisine-${c}`}
                checked={filters.cuisines.includes(c)}
                onCheckedChange={() => setCuisines(c)}
                data-ocid={`filter.cuisine.${c.toLowerCase().replace(/\s+/g, "-")}`}
              />
              <Label
                htmlFor={`cuisine-${c}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {c}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Price Range
        </p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrices(p)}
              className={`px-3 py-1 rounded-full text-sm border transition-smooth ${
                filters.priceRanges.includes(p)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
              data-ocid={`filter.price.${p.replace(/\$/g, "d")}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Neighborhood
        </p>
        <div className="space-y-2">
          {NEIGHBORHOODS.map((n) => (
            <div key={n} className="flex items-center gap-2">
              <Checkbox
                id={`nbhd-${n}`}
                checked={filters.neighborhoods.includes(n)}
                onCheckedChange={() => setNeighborhoods(n)}
                data-ocid={`filter.neighborhood.${n.toLowerCase().replace(/\s+/g, "-")}`}
              />
              <Label
                htmlFor={`nbhd-${n}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {n}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Active
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              ...filters.cuisines,
              ...filters.priceRanges,
              ...filters.neighborhoods,
            ].map((chip) => (
              <Badge
                key={chip}
                variant="secondary"
                className="flex items-center gap-1 pr-1.5 text-xs"
              >
                {chip}
                <button
                  type="button"
                  onClick={() => {
                    if (filters.cuisines.includes(chip)) setCuisines(chip);
                    else if (filters.priceRanges.includes(chip))
                      setPrices(chip);
                    else setNeighborhoods(chip);
                  }}
                  className="ml-0.5 hover:text-destructive transition-colors"
                  aria-label={`Remove ${chip} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
