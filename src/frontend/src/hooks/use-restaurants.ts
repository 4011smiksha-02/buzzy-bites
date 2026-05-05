import { createActor } from "@/backend";
import type { Restaurant, SearchFilters } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

function toRestaurant(r: unknown): Restaurant {
  const raw = r as Record<string, unknown>;
  return {
    id: raw.id as bigint,
    name: (raw.name as string) ?? "",
    description: (raw.description as string) ?? "",
    cuisine: (raw.cuisine as string) ?? "",
    location: (raw.location as string) ?? "",
    address: (raw.address as string) ?? "",
    priceRange: (raw.priceRange as Restaurant["priceRange"]) ?? "$",
    rating:
      typeof raw.averageRating === "number"
        ? raw.averageRating
        : typeof raw.rating === "number"
          ? raw.rating
          : 0,
    reviewCount:
      typeof raw.reviewCount === "bigint" ? raw.reviewCount : BigInt(0),
    coverImage: (raw.coverImage as string) ?? "",
    openingHours: (raw.openingHours as string) ?? "",
    phone: (raw.phone as string) ?? "",
    email: (raw.email as string) ?? "",
    website: (raw.website as string) ?? "",
    features: Array.isArray(raw.features) ? (raw.features as string[]) : [],
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    createdAt: typeof raw.createdAt === "bigint" ? raw.createdAt : BigInt(0),
  } satisfies Restaurant;
}

export function useRestaurants(filters?: Partial<SearchFilters>) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Restaurant[]>({
    queryKey: ["restaurants", filters],
    queryFn: async () => {
      if (!anyActor) return [];
      const results = await anyActor.searchRestaurants({
        nameQuery: filters?.query ?? "",
        cuisineType: filters?.cuisine ?? "",
        neighborhood: filters?.location ?? "",
      });
      return (results as unknown[]).map(toRestaurant);
    },
    enabled: !!anyActor && !isFetching,
  });
}

export function useRestaurant(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Restaurant | null>({
    queryKey: ["restaurant", id?.toString()],
    queryFn: async () => {
      if (!anyActor || id === null) return null;
      const result = await anyActor.getRestaurant(id);
      const r = result as { __kind__: string; value?: unknown };
      if (r.__kind__ === "Some" && r.value) return toRestaurant(r.value);
      return null;
    },
    enabled: !!anyActor && !isFetching && id !== null,
  });
}

export function useMenuItems(restaurantId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery({
    queryKey: ["menuItems", restaurantId?.toString()],
    queryFn: async () => {
      if (!anyActor || restaurantId === null) return [];
      return anyActor.getMenuItems(restaurantId);
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null,
  });
}

export function useGalleryImages(restaurantId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery({
    queryKey: ["galleryImages", restaurantId?.toString()],
    queryFn: async () => {
      if (!anyActor || restaurantId === null) return [];
      return anyActor.getGalleryImages(restaurantId);
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null,
  });
}

export function useAdminRestaurant() {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Restaurant | null>({
    queryKey: ["adminRestaurant"],
    queryFn: async () => {
      if (!anyActor) return null;
      const result = await anyActor.getAdminRestaurant();
      const r = result as { __kind__: string; value?: unknown };
      if (r.__kind__ === "Some" && r.value) return toRestaurant(r.value);
      return null;
    },
    enabled: !!anyActor && !isFetching,
  });
}
