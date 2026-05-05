import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import ReservationTypes "../types/reservation";
import RestaurantTypes "../types/restaurant";
import UserTypes "../types/user";
import ReservationLib "../lib/reservation";
import UserLib "../lib/user";

mixin (
  reservations : List.List<ReservationTypes.Reservation>,
  availabilitySettings : Map.Map<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>,
  adminLinks : Map.Map<CommonTypes.UserId, CommonTypes.RestaurantId>,
  userProfiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
  nextReservationId : CommonTypes.Counter
) {
  // Guest booking
  public shared ({ caller }) func createReservation(input : ReservationTypes.ReservationInput) : async ReservationTypes.ReservationPublic {
    let now = Time.now();
    let result = ReservationLib.createReservation(reservations, nextReservationId.val, input, now);
    // Link to user profile if caller is authenticated (not anonymous)
    if (not caller.isAnonymous()) {
      UserLib.linkReservationToUser(userProfiles, caller, nextReservationId.val);
    };
    nextReservationId.val += 1;
    result
  };

  public query func checkAvailability(restaurantId : CommonTypes.RestaurantId, date : Text, timeSlot : Text) : async ReservationTypes.AvailabilityResult {
    ReservationLib.checkAvailability(reservations, availabilitySettings, restaurantId, date, timeSlot)
  };

  public query func getReservationByReference(bookingReference : Text) : async ?ReservationTypes.ReservationPublic {
    switch (reservations.find(func(r) { r.bookingReference == bookingReference })) {
      case (?r) ?ReservationLib.toPublic(r);
      case null null;
    }
  };

  public query func getReservationsByEmail(email : Text) : async [ReservationTypes.ReservationPublic] {
    ReservationLib.getReservationsByEmail(reservations, email)
  };

  // Authenticated user reservations
  public shared query ({ caller }) func getMyReservations() : async [ReservationTypes.ReservationPublic] {
    UserLib.getReservationsByPrincipal(userProfiles, reservations, caller)
  };

  // Admin reservation management
  public query func getReservationsByRestaurant(restaurantId : CommonTypes.RestaurantId) : async [ReservationTypes.ReservationPublic] {
    ReservationLib.getReservationsByRestaurant(reservations, restaurantId)
  };

  public shared ({ caller }) func confirmReservation(id : CommonTypes.ReservationId) : async ?ReservationTypes.ReservationPublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?_) ReservationLib.updateReservationStatus(reservations, id, #confirmed);
    }
  };

  public shared ({ caller }) func cancelReservation(id : CommonTypes.ReservationId) : async ?ReservationTypes.ReservationPublic {
    // Allow admin or guest (anyone) to cancel
    ReservationLib.updateReservationStatus(reservations, id, #cancelled)
  };
};
