import { u as useActor, a as useQuery, c as createActor } from "./backend-B16RMoSg.js";
import "./index-Cccc_cne.js";
function toRestaurant(r) {
  const raw = r;
  return {
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? "",
    cuisine: raw.cuisine ?? "",
    location: raw.location ?? "",
    address: raw.address ?? "",
    priceRange: raw.priceRange ?? "$",
    rating: typeof raw.averageRating === "number" ? raw.averageRating : typeof raw.rating === "number" ? raw.rating : 0,
    reviewCount: typeof raw.reviewCount === "bigint" ? raw.reviewCount : BigInt(0),
    coverImage: raw.coverImage ?? "",
    openingHours: raw.openingHours ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    website: raw.website ?? "",
    features: Array.isArray(raw.features) ? raw.features : [],
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    createdAt: typeof raw.createdAt === "bigint" ? raw.createdAt : BigInt(0)
  };
}
function useRestaurants(filters) {
  const { actor, isFetching } = useActor(createActor);
  const anyActor = actor;
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: async () => {
      if (!anyActor) return [];
      const results = await anyActor.searchRestaurants({
        nameQuery: (filters == null ? void 0 : filters.query) ?? "",
        cuisineType: (filters == null ? void 0 : filters.cuisine) ?? "",
        neighborhood: (filters == null ? void 0 : filters.location) ?? ""
      });
      return results.map(toRestaurant);
    },
    enabled: !!anyActor && !isFetching
  });
}
function useRestaurant(id) {
  const { actor, isFetching } = useActor(createActor);
  const anyActor = actor;
  return useQuery({
    queryKey: ["restaurant", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!anyActor || id === null) return null;
      const result = await anyActor.getRestaurant(id);
      const r = result;
      if (r.__kind__ === "Some" && r.value) return toRestaurant(r.value);
      return null;
    },
    enabled: !!anyActor && !isFetching && id !== null
  });
}
function useMenuItems(restaurantId) {
  const { actor, isFetching } = useActor(createActor);
  const anyActor = actor;
  return useQuery({
    queryKey: ["menuItems", restaurantId == null ? void 0 : restaurantId.toString()],
    queryFn: async () => {
      if (!anyActor || restaurantId === null) return [];
      return anyActor.getMenuItems(restaurantId);
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null
  });
}
function useGalleryImages(restaurantId) {
  const { actor, isFetching } = useActor(createActor);
  const anyActor = actor;
  return useQuery({
    queryKey: ["galleryImages", restaurantId == null ? void 0 : restaurantId.toString()],
    queryFn: async () => {
      if (!anyActor || restaurantId === null) return [];
      return anyActor.getGalleryImages(restaurantId);
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null
  });
}
function useAdminRestaurant() {
  const { actor, isFetching } = useActor(createActor);
  const anyActor = actor;
  return useQuery({
    queryKey: ["adminRestaurant"],
    queryFn: async () => {
      if (!anyActor) return null;
      const result = await anyActor.getAdminRestaurant();
      const r = result;
      if (r.__kind__ === "Some" && r.value) return toRestaurant(r.value);
      return null;
    },
    enabled: !!anyActor && !isFetching
  });
}
export {
  useRestaurant as a,
  useMenuItems as b,
  useGalleryImages as c,
  useAdminRestaurant as d,
  useRestaurants as u
};
