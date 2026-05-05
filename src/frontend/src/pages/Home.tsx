import { FilterPanel } from "@/components/restaurant/FilterPanel";
import type { FilterState } from "@/components/restaurant/FilterPanel";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { SearchBar } from "@/components/restaurant/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRestaurants } from "@/hooks/use-restaurants";
import type { Restaurant } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 9;

type SortOption = "rating" | "name";

const EMPTY_FILTERS: FilterState = {
  cuisines: [],
  priceRanges: [],
  neighborhoods: [],
};

// ---- Skeleton cards while loading ----
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border shadow-warm">
      <Skeleton className="h-52 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

// ---- Main page ----
export default function Home() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("rating");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: allRestaurants = [], isLoading } = useRestaurants({
    query,
    cuisine: filters.cuisines[0] ?? "",
    location: filters.neighborhoods[0] ?? "",
  });

  // Client-side multi-filter + sort
  const filtered = useMemo(() => {
    let results: Restaurant[] = allRestaurants;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q),
      );
    }
    if (filters.cuisines.length > 0) {
      results = results.filter((r) => filters.cuisines.includes(r.cuisine));
    }
    if (filters.priceRanges.length > 0) {
      results = results.filter((r) =>
        filters.priceRanges.includes(r.priceRange),
      );
    }
    if (filters.neighborhoods.length > 0) {
      results = results.filter((r) =>
        filters.neighborhoods.includes(r.location),
      );
    }

    results = [...results].sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name),
    );
    return results;
  }, [allRestaurants, query, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const activeFilterCount =
    filters.cuisines.length +
    filters.priceRanges.length +
    filters.neighborhoods.length;

  // Reset to page 1 when filters/search/sort change
  function handleQuery(val: string) {
    setQuery(val);
    setPage(1);
  }
  function handleFilters(f: FilterState) {
    setFilters(f);
    setPage(1);
  }
  function handleSort(val: string) {
    setSort(val as SortOption);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="home.page">
      {/* ---- Hero section ---- */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Discover. Reserve.
              <span className="text-primary"> Savor.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground font-body">
              Find your next favourite table — from intimate bistros to
              celebrated fine dining.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-8 max-w-2xl"
          >
            <SearchBar value={query} onChange={handleQuery} />
          </motion.div>
        </div>
      </section>

      {/* ---- Body: sidebar + grid ---- */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onChange={handleFilters} />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-1.5"
                  onClick={() => setFilterOpen(!filterOpen)}
                  data-ocid="filter.toggle"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground">
                  {isLoading ? (
                    <Skeleton className="inline-block h-4 w-24" />
                  ) : (
                    <span>
                      <span className="font-semibold text-foreground">
                        {filtered.length}
                      </span>{" "}
                      {filtered.length === 1 ? "restaurant" : "restaurants"}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Sort by
                </span>
                <Select value={sort} onValueChange={handleSort}>
                  <SelectTrigger
                    className="w-36 h-9 text-sm bg-card"
                    data-ocid="sort.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="name">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile filter drawer */}
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 lg:hidden"
              >
                <FilterPanel filters={filters} onChange={handleFilters} />
              </motion.div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                data-ocid="restaurant.loading_state"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
                data-ocid="restaurant.empty_state"
              >
                <UtensilsCrossed className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No restaurants found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Try adjusting your search or clearing some filters to discover
                  more tables.
                </p>
                {(query || activeFilterCount > 0) && (
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => {
                      handleQuery("");
                      handleFilters(EMPTY_FILTERS);
                    }}
                    data-ocid="restaurant.clear_filters_button"
                  >
                    Clear search &amp; filters
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((restaurant, i) => (
                  <RestaurantCard
                    key={restaurant.id.toString()}
                    restaurant={restaurant}
                    index={i}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                  data-ocid="pagination_prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const num = i + 1;
                    const isActive = num === safePage;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPage(num)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-smooth ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-warm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                        data-ocid={`pagination.page.${num}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                  data-ocid="pagination_next"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
