module {
  public type Timestamp = Int;
  public type RestaurantId = Nat;
  public type MenuItemId = Nat;
  public type GalleryImageId = Nat;
  public type ReservationId = Nat;
  public type UserId = Principal;
  public type Counter = { var val : Nat };
  public func newCounter() : Counter { { var val = 0 } };
};
