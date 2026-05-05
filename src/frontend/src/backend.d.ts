import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface RestaurantPublic {
    id: RestaurantId;
    neighborhood: string;
    name: string;
    cuisineType: string;
    description: string;
    email: string;
    priceRange: PriceRange;
    averageRating: number;
    address: string;
    openingHours: Array<OpeningHours>;
    phone: string;
}
export interface SearchFilter {
    sortBy?: SortField;
    neighborhood?: string;
    nameQuery?: string;
    cuisineType?: string;
    priceRange?: PriceRange;
}
export interface AvailabilitySettingsPublic {
    bookingLeadTimeDays: bigint;
    maxCoversPerService: bigint;
    maxPartySize: bigint;
    restaurantId: RestaurantId;
    availableTimeSlots: Array<string>;
}
export interface ReservationPublic {
    id: ReservationId;
    status: ReservationStatus;
    bookingReference: string;
    date: string;
    guestCount: bigint;
    specialRequests: string;
    createdAt: Timestamp;
    guestName: string;
    guestEmail: string;
    restaurantId: RestaurantId;
    guestPhone: string;
    timeSlot: string;
}
export interface RestaurantInput {
    neighborhood: string;
    name: string;
    cuisineType: string;
    description: string;
    email: string;
    priceRange: PriceRange;
    address: string;
    openingHours: Array<OpeningHours>;
    phone: string;
}
export type RestaurantId = bigint;
export type ReservationId = bigint;
export interface UserProfilePublic {
    reservationIds: Array<ReservationId>;
    userId: UserId;
    favoriteRestaurantIds: Array<RestaurantId>;
}
export interface MenuItemInput {
    name: string;
    description: string;
    restaurantId: RestaurantId;
    imageUrl?: string;
    category: MenuCategory;
    price: number;
}
export type UserId = Principal;
export interface OpeningHours {
    day: DayOfWeek;
    closed: boolean;
    close: string;
    open: string;
}
export type MenuItemId = bigint;
export interface GalleryImagePublic {
    id: GalleryImageId;
    url: string;
    order: bigint;
    restaurantId: RestaurantId;
    caption: string;
}
export type GalleryImageId = bigint;
export interface AvailabilitySettingsInput {
    bookingLeadTimeDays: bigint;
    maxCoversPerService: bigint;
    maxPartySize: bigint;
    availableTimeSlots: Array<string>;
}
export interface AvailabilityResult {
    date: string;
    restaurantId: RestaurantId;
    reservedSeats: bigint;
    availableSeats: bigint;
    timeSlot: string;
    totalCapacity: bigint;
}
export interface MenuItemPublic {
    id: MenuItemId;
    name: string;
    description: string;
    restaurantId: RestaurantId;
    imageUrl?: string;
    category: MenuCategory;
    price: number;
}
export interface GalleryImageInput {
    url: string;
    order: bigint;
    restaurantId: RestaurantId;
    caption: string;
}
export interface ReservationInput {
    date: string;
    guestCount: bigint;
    specialRequests: string;
    guestName: string;
    guestEmail: string;
    restaurantId: RestaurantId;
    guestPhone: string;
    timeSlot: string;
}
export enum DayOfWeek {
    tuesday = "tuesday",
    wednesday = "wednesday",
    saturday = "saturday",
    thursday = "thursday",
    sunday = "sunday",
    friday = "friday",
    monday = "monday"
}
export enum MenuCategory {
    dessert = "dessert",
    main = "main",
    appetizer = "appetizer",
    drink = "drink"
}
export enum PriceRange {
    one = "one",
    two = "two",
    three = "three",
    four = "four"
}
export enum ReservationStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum SortField {
    name = "name",
    rating = "rating"
}
export interface backendInterface {
    addFavoriteRestaurant(restaurantId: RestaurantId): Promise<UserProfilePublic>;
    addGalleryImage(input: GalleryImageInput): Promise<GalleryImagePublic>;
    addMenuItem(input: MenuItemInput): Promise<MenuItemPublic>;
    cancelReservation(id: ReservationId): Promise<ReservationPublic | null>;
    checkAvailability(restaurantId: RestaurantId, date: string, timeSlot: string): Promise<AvailabilityResult>;
    confirmReservation(id: ReservationId): Promise<ReservationPublic | null>;
    createReservation(input: ReservationInput): Promise<ReservationPublic>;
    createRestaurant(input: RestaurantInput): Promise<RestaurantPublic>;
    deleteGalleryImage(id: GalleryImageId): Promise<boolean>;
    deleteMenuItem(id: MenuItemId): Promise<boolean>;
    getAvailabilitySettings(restaurantId: RestaurantId): Promise<AvailabilitySettingsPublic | null>;
    getGalleryImages(restaurantId: RestaurantId): Promise<Array<GalleryImagePublic>>;
    getMenuItems(restaurantId: RestaurantId): Promise<Array<MenuItemPublic>>;
    getMyProfile(): Promise<UserProfilePublic>;
    getMyReservationHistory(): Promise<Array<ReservationPublic>>;
    getMyReservations(): Promise<Array<ReservationPublic>>;
    getMyRestaurant(): Promise<RestaurantId | null>;
    getReservationByReference(bookingReference: string): Promise<ReservationPublic | null>;
    getReservationsByEmail(email: string): Promise<Array<ReservationPublic>>;
    getReservationsByRestaurant(restaurantId: RestaurantId): Promise<Array<ReservationPublic>>;
    getRestaurant(id: RestaurantId): Promise<RestaurantPublic | null>;
    linkAdminToRestaurant(restaurantId: RestaurantId): Promise<void>;
    removeFavoriteRestaurant(restaurantId: RestaurantId): Promise<UserProfilePublic>;
    searchRestaurants(filter: SearchFilter): Promise<Array<RestaurantPublic>>;
    updateGalleryImage(id: GalleryImageId, input: GalleryImageInput): Promise<GalleryImagePublic | null>;
    updateMenuItem(id: MenuItemId, input: MenuItemInput): Promise<MenuItemPublic | null>;
    updateRestaurant(id: RestaurantId, input: RestaurantInput): Promise<RestaurantPublic | null>;
    upsertAvailabilitySettings(restaurantId: RestaurantId, input: AvailabilitySettingsInput): Promise<AvailabilitySettingsPublic>;
}
