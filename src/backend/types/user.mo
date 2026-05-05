import CommonTypes "common";

module {
  public type UserProfile = {
    userId : CommonTypes.UserId;
    var favoriteRestaurantIds : [CommonTypes.RestaurantId];
    var reservationIds : [CommonTypes.ReservationId];
  };

  public type UserProfilePublic = {
    userId : CommonTypes.UserId;
    favoriteRestaurantIds : [CommonTypes.RestaurantId];
    reservationIds : [CommonTypes.ReservationId];
  };

  public type AdminLink = {
    adminId : CommonTypes.UserId;
    restaurantId : CommonTypes.RestaurantId;
  };
};
