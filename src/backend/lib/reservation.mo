import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import CommonTypes "../types/common";
import ReservationTypes "../types/reservation";
import RestaurantTypes "../types/restaurant";

module {
  public func toPublic(r : ReservationTypes.Reservation) : ReservationTypes.ReservationPublic {
    {
      id = r.id;
      restaurantId = r.restaurantId;
      guestName = r.guestName;
      guestEmail = r.guestEmail;
      guestPhone = r.guestPhone;
      date = r.date;
      timeSlot = r.timeSlot;
      guestCount = r.guestCount;
      specialRequests = r.specialRequests;
      status = r.status;
      bookingReference = r.bookingReference;
      createdAt = r.createdAt;
    }
  };

  public func generateBookingReference(
    restaurantId : CommonTypes.RestaurantId,
    reservationId : CommonTypes.ReservationId,
    createdAt : CommonTypes.Timestamp
  ) : Text {
    let ts : Nat = if (createdAt < 0) 0 else createdAt.toNat();
    "BB-" # restaurantId.toText() # "-" # reservationId.toText() # "-" # (ts % 100000).toText()
  };

  public func createReservation(
    reservations : List.List<ReservationTypes.Reservation>,
    nextId : Nat,
    input : ReservationTypes.ReservationInput,
    createdAt : CommonTypes.Timestamp
  ) : ReservationTypes.ReservationPublic {
    let bookingRef = generateBookingReference(input.restaurantId, nextId, createdAt);
    let r : ReservationTypes.Reservation = {
      id = nextId;
      restaurantId = input.restaurantId;
      var guestName = input.guestName;
      var guestEmail = input.guestEmail;
      var guestPhone = input.guestPhone;
      var date = input.date;
      var timeSlot = input.timeSlot;
      var guestCount = input.guestCount;
      var specialRequests = input.specialRequests;
      var status = #pending;
      bookingReference = bookingRef;
      createdAt;
    };
    reservations.add(r);
    toPublic(r)
  };

  public func getReservation(
    reservations : List.List<ReservationTypes.Reservation>,
    id : CommonTypes.ReservationId
  ) : ?ReservationTypes.ReservationPublic {
    switch (reservations.find(func(r) { r.id == id })) {
      case (?r) ?toPublic(r);
      case null null;
    }
  };

  public func getReservationsByRestaurant(
    reservations : List.List<ReservationTypes.Reservation>,
    restaurantId : CommonTypes.RestaurantId
  ) : [ReservationTypes.ReservationPublic] {
    reservations
      .filter(func(r) { r.restaurantId == restaurantId })
      .toArray()
      .map<ReservationTypes.Reservation, ReservationTypes.ReservationPublic>(toPublic)
  };

  public func getReservationsByEmail(
    reservations : List.List<ReservationTypes.Reservation>,
    email : Text
  ) : [ReservationTypes.ReservationPublic] {
    reservations
      .filter(func(r) { r.guestEmail == email })
      .toArray()
      .map<ReservationTypes.Reservation, ReservationTypes.ReservationPublic>(toPublic)
  };

  public func updateReservationStatus(
    reservations : List.List<ReservationTypes.Reservation>,
    id : CommonTypes.ReservationId,
    status : ReservationTypes.ReservationStatus
  ) : ?ReservationTypes.ReservationPublic {
    switch (reservations.find(func(r) { r.id == id })) {
      case null null;
      case (?r) {
        r.status := status;
        ?toPublic(r)
      };
    }
  };

  public func checkAvailability(
    reservations : List.List<ReservationTypes.Reservation>,
    settingsMap : Map.Map<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>,
    restaurantId : CommonTypes.RestaurantId,
    date : Text,
    timeSlot : Text
  ) : ReservationTypes.AvailabilityResult {
    let totalCapacity = switch (settingsMap.get(restaurantId)) {
      case (?s) s.maxCoversPerService;
      case null 0;
    };
    let reservedSeats = reservations
      .filter(func(r) {
        r.restaurantId == restaurantId and
        r.date == date and
        r.timeSlot == timeSlot and
        r.status != #cancelled
      })
      .foldLeft(0, func(acc, r) { acc + r.guestCount });
    let available = if (totalCapacity > reservedSeats) totalCapacity - reservedSeats else 0;
    {
      restaurantId;
      date;
      timeSlot;
      totalCapacity;
      reservedSeats;
      availableSeats = available;
    }
  };
};
