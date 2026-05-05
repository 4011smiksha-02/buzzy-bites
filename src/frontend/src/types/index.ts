export type CuisineType =
  | "Italian"
  | "Japanese"
  | "French"
  | "Modern European"
  | "Indian"
  | "Mediterranean"
  | "American"
  | "Chinese"
  | "Mexican"
  | "Thai";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type ReservationStatus =
  | { __kind__: "Pending" }
  | { __kind__: "Confirmed" }
  | { __kind__: "Cancelled" }
  | { __kind__: "Completed" };

export interface Restaurant {
  id: bigint;
  name: string;
  description: string;
  cuisine: string;
  location: string;
  address: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: bigint;
  coverImage: string;
  openingHours: string;
  phone: string;
  email: string;
  website: string;
  features: string[];
  isActive: boolean;
  createdAt: bigint;
}

export interface MenuItem {
  id: bigint;
  restaurantId: bigint;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export interface GalleryImage {
  id: bigint;
  restaurantId: bigint;
  url: string;
  caption: string;
  order: bigint;
}

export interface Reservation {
  id: bigint;
  restaurantId: bigint;
  restaurantName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: bigint;
  date: string;
  time: string;
  specialRequests: string;
  status: ReservationStatus;
  referenceCode: string;
  createdAt: bigint;
}

export interface AvailabilitySettings {
  restaurantId: bigint;
  openTime: string;
  closeTime: string;
  slotDurationMinutes: bigint;
  maxPartySizePerSlot: bigint;
  daysOpen: number[];
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  remainingCapacity: bigint;
}

export interface CreateReservationInput {
  restaurantId: bigint;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: bigint;
  date: string;
  time: string;
  specialRequests: string;
}

export interface SearchFilters {
  query: string;
  cuisine: string;
  location: string;
  priceRange: string;
}
