import {
  GalleryGrid,
  GalleryLightbox,
} from "@/components/restaurant/GalleryLightbox";
import { ImageCarousel } from "@/components/restaurant/ImageCarousel";
import { MenuSection } from "@/components/restaurant/MenuSection";
import { ReservationWidget } from "@/components/restaurant/ReservationWidget";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGalleryImages,
  useMenuItems,
  useRestaurant,
} from "@/hooks/use-restaurants";
import type { GalleryImage, MenuItem } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";

const AMBIENCE_IMAGES = [
  "/assets/generated/restaurant-ambience-1.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-2.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-3.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-4.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-5.dim_1200x700.jpg",
];

type Tab = "overview" | "menu" | "gallery";

const HOURS_DATA = [
  { day: "Monday", open: "12:00", close: "22:00" },
  { day: "Tuesday", open: "12:00", close: "22:00" },
  { day: "Wednesday", open: "12:00", close: "22:30" },
  { day: "Thursday", open: "12:00", close: "22:30" },
  { day: "Friday", open: "12:00", close: "23:00" },
  { day: "Saturday", open: "11:00", close: "23:00" },
  { day: "Sunday", open: "11:00", close: "21:00" },
];

function groupMenuByCategory(items: MenuItem[]) {
  const map: Record<string, MenuItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  }
  return map;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-foreground">
        {(rating ?? 0).toFixed(1)}
      </span>
    </span>
  );
}

function RestaurantDetailSkeleton() {
  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6"
      data-ocid="restaurant.loading_state"
    >
      <Skeleton
        className="w-full rounded-2xl mb-6"
        style={{ aspectRatio: "16/7" }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams({ from: "/layout/restaurants/$id" });
  const navigate = useNavigate();
  const restaurantId = BigInt(id);

  const { data: restaurant, isLoading: restLoading } =
    useRestaurant(restaurantId);
  const { data: menuItemsRaw = [], isLoading: menuLoading } =
    useMenuItems(restaurantId);
  const { data: galleryRaw = [], isLoading: galleryLoading } =
    useGalleryImages(restaurantId);

  const menuItems = menuItemsRaw as MenuItem[];
  const galleryImages = galleryRaw as GalleryImage[];

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const menuByCategory = groupMenuByCategory(menuItems);
  const categoryOrder = [
    "Appetizers",
    "Starters",
    "Mains",
    "Pasta",
    "Desserts",
    "Drinks",
  ];
  const sortedCategories = Object.keys(menuByCategory).sort(
    (a, b) =>
      (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
      (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b)),
  );

  const carouselImages =
    galleryImages.length > 0
      ? galleryImages.slice(0, 5).map((g) => g.url)
      : AMBIENCE_IMAGES;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  if (restLoading) return <RestaurantDetailSkeleton />;
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Restaurant not found.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="restaurant.back_link"
          className="text-primary underline text-sm hover:text-primary/80 transition-smooth"
        >
          Back to explore
        </button>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    {
      key: "gallery",
      label: `Gallery${galleryImages.length ? ` (${galleryImages.length})` : ""}`,
    },
  ];

  return (
    <div className="bg-background" data-ocid="restaurant.page">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back nav */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="restaurant.back_button"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-5 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" /> Back to restaurants
        </button>

        {/* Hero carousel */}
        <ImageCarousel images={carouselImages} altPrefix={restaurant.name} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === Main column === */}
          <div className="lg:col-span-2">
            {/* Restaurant header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize text-xs">
                  {restaurant.cuisine}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {restaurant.priceRange}
                </Badge>
                {restaurant.features?.slice(0, 2).map((f) => (
                  <Badge
                    key={f}
                    variant="outline"
                    className="text-xs border-accent/30 text-accent"
                  >
                    {f}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <StarRating rating={restaurant.rating} />
                <span>
                  {Number(restaurant.reviewCount).toLocaleString()} reviews
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {restaurant.location}
                </span>
              </div>
              {restaurant.description && (
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {restaurant.description}
                </p>
              )}
            </div>

            {/* Tab nav */}
            <div
              className="flex border-b border-border mb-6 gap-1"
              role="tablist"
              data-ocid="restaurant.tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  data-ocid={`restaurant.tab.${tab.key}`}
                  className={[
                    "px-4 py-2.5 text-sm font-medium transition-smooth border-b-2 -mb-px",
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
              <div data-ocid="restaurant.overview_tab">
                {/* Map placeholder */}
                <div className="w-full h-44 rounded-xl bg-muted overflow-hidden mb-6 flex items-center justify-center border border-border">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MapPin className="w-8 h-8" />
                    <span className="text-sm">{restaurant.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Hours */}
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-3">
                      Hours
                    </h3>
                    <div className="space-y-2">
                      {HOURS_DATA.map(({ day, open, close }) => (
                        <div
                          key={day}
                          className={[
                            "flex justify-between text-sm py-1 border-b border-border/50",
                            day === today
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground",
                          ].join(" ")}
                        >
                          <span>{day}</span>
                          <span>
                            {open} – {close}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-3">
                      Contact &amp; Details
                    </h3>
                    <div className="space-y-3">
                      {restaurant.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{restaurant.address}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <a
                          href={`tel:${restaurant.phone}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          <Phone className="w-4 h-4 shrink-0" />
                          {restaurant.phone}
                        </a>
                      )}
                      {restaurant.email && (
                        <a
                          href={`mailto:${restaurant.email}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          <Mail className="w-4 h-4 shrink-0" />
                          {restaurant.email}
                        </a>
                      )}
                      {restaurant.website && (
                        <a
                          href={restaurant.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                        >
                          <Globe className="w-4 h-4 shrink-0" />
                          {restaurant.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {restaurant.openingHours && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0" />
                          {restaurant.openingHours}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "menu" && (
              <div data-ocid="restaurant.menu_tab">
                {menuLoading ? (
                  <div className="space-y-6" data-ocid="menu.loading_state">
                    {[1, 2, 3].map((n) => (
                      <div key={n}>
                        <Skeleton className="h-6 w-32 mb-3" />
                        {[1, 2, 3].map((m) => (
                          <Skeleton key={m} className="h-16 w-full mb-2" />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : sortedCategories.length === 0 ? (
                  <div
                    className="flex flex-col items-center gap-3 py-16"
                    data-ocid="menu.empty_state"
                  >
                    <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No menu items available yet.
                    </p>
                  </div>
                ) : (
                  sortedCategories.map((cat) => (
                    <MenuSection
                      key={cat}
                      category={cat}
                      items={menuByCategory[cat]}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "gallery" && (
              <div data-ocid="restaurant.gallery_tab">
                {galleryLoading ? (
                  <div
                    className="columns-2 md:columns-3 gap-3 space-y-3"
                    data-ocid="gallery.loading_state"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                        key={`skeleton-${i}`}
                        className="w-full h-40 rounded-lg break-inside-avoid"
                      />
                    ))}
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div
                    className="flex flex-col items-center gap-3 py-16"
                    data-ocid="gallery.empty_state"
                  >
                    <p className="text-muted-foreground">
                      No gallery images yet.
                    </p>
                  </div>
                ) : (
                  <GalleryGrid
                    images={galleryImages}
                    onImageClick={(i) => setLightboxIndex(i)}
                  />
                )}

                <GalleryLightbox
                  images={galleryImages}
                  currentIndex={lightboxIndex}
                  onClose={() => setLightboxIndex(null)}
                  onPrev={() =>
                    setLightboxIndex((idx) =>
                      idx === null
                        ? null
                        : (idx - 1 + galleryImages.length) %
                          galleryImages.length,
                    )
                  }
                  onNext={() =>
                    setLightboxIndex((idx) =>
                      idx === null ? null : (idx + 1) % galleryImages.length,
                    )
                  }
                />
              </div>
            )}
          </div>

          {/* === Sticky sidebar (desktop) === */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReservationWidget restaurant={restaurant} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
