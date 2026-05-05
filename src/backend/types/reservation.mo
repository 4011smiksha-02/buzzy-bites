import CommonTypes "common";

module {
  public type ReservationStatus = {
    #pending; #confirmed; #cancelled
  };

  public type Reservation = {
    id : CommonTypes.ReservationId;
    restaurantId : CommonTypes.RestaurantId;
    var guestName : Text;
    var guestEmail : Text;
    var guestPhone : Text;
    var date : Text;       // "YYYY-MM-DD"
    var timeSlot : Text;   // "HH:MM"
    var guestCount : Nat;
    var specialRequests : Text;
    var status : ReservationStatus;
    bookingReference : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type ReservationPublic = {
    id : CommonTypes.ReservationId;
    restaurantId : CommonTypes.RestaurantId;
    guestName : Text;
    guestEmail : Text;
    guestPhone : Text;
    date : Text;
    timeSlot : Text;
    guestCount : Nat;
    specialRequests : Text;
    status : ReservationStatus;
    bookingReference : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type ReservationInput = {
    restaurantId : CommonTypes.RestaurantId;
    guestName : Text;
    guestEmail : Text;
    guestPhone : Text;
    date : Text;
    timeSlot : Text;
    guestCount : Nat;
    specialRequests : Text;
  };

  public type AvailabilityResult = {
    restaurantId : CommonTypes.RestaurantId;
    date : Text;
    timeSlot : Text;
    totalCapacity : Nat;
    reservedSeats : Nat;
    availableSeats : Nat;
  };
};
