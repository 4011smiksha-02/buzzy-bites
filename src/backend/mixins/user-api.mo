import Map "mo:core/Map";
import List "mo:core/List";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import ReservationTypes "../types/reservation";
import UserLib "../lib/user";

mixin (
  userProfiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
  reservations : List.List<ReservationTypes.Reservation>
) {
  public shared query ({ caller }) func getMyProfile() : async UserTypes.UserProfilePublic {
    UserLib.getOrCreateProfile(userProfiles, caller)
  };

  public shared ({ caller }) func addFavoriteRestaurant(restaurantId : CommonTypes.RestaurantId) : async UserTypes.UserProfilePublic {
    UserLib.addFavoriteRestaurant(userProfiles, caller, restaurantId)
  };

  public shared ({ caller }) func removeFavoriteRestaurant(restaurantId : CommonTypes.RestaurantId) : async UserTypes.UserProfilePublic {
    UserLib.removeFavoriteRestaurant(userProfiles, caller, restaurantId)
  };

  public shared query ({ caller }) func getMyReservationHistory() : async [ReservationTypes.ReservationPublic] {
    UserLib.getReservationsByPrincipal(userProfiles, reservations, caller)
  };
};
