import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import RestaurantTypes "../types/restaurant";
import UserTypes "../types/user";
import RestaurantLib "../lib/restaurant";
import UserLib "../lib/user";

mixin (
  restaurants : List.List<RestaurantTypes.Restaurant>,
  availabilitySettings : Map.Map<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>,
  adminLinks : Map.Map<CommonTypes.UserId, CommonTypes.RestaurantId>,
  nextRestaurantId : CommonTypes.Counter
) {
  // Public browse
  public query func searchRestaurants(filter : RestaurantTypes.SearchFilter) : async [RestaurantTypes.RestaurantPublic] {
    RestaurantLib.searchRestaurants(restaurants, filter)
  };

  public query func getRestaurant(id : CommonTypes.RestaurantId) : async ?RestaurantTypes.RestaurantPublic {
    RestaurantLib.getRestaurant(restaurants, id)
  };

  public query func getAvailabilitySettings(restaurantId : CommonTypes.RestaurantId) : async ?RestaurantTypes.AvailabilitySettingsPublic {
    RestaurantLib.getAvailabilitySettings(availabilitySettings, restaurantId)
  };

  // Admin management
  public shared ({ caller }) func createRestaurant(input : RestaurantTypes.RestaurantInput) : async RestaurantTypes.RestaurantPublic {
    let result = RestaurantLib.createRestaurant(restaurants, nextRestaurantId.val, input);
    UserLib.linkAdminToRestaurant(adminLinks, caller, nextRestaurantId.val);
    nextRestaurantId.val += 1;
    result
  };

  public shared ({ caller }) func updateRestaurant(id : CommonTypes.RestaurantId, input : RestaurantTypes.RestaurantInput) : async ?RestaurantTypes.RestaurantPublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?adminRestaurantId) {
        if (adminRestaurantId != id) Runtime.trap("Not authorized for this restaurant");
        RestaurantLib.updateRestaurant(restaurants, id, input)
      };
    }
  };

  public shared ({ caller }) func upsertAvailabilitySettings(restaurantId : CommonTypes.RestaurantId, input : RestaurantTypes.AvailabilitySettingsInput) : async RestaurantTypes.AvailabilitySettingsPublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?adminRestaurantId) {
        if (adminRestaurantId != restaurantId) Runtime.trap("Not authorized for this restaurant");
        RestaurantLib.upsertAvailabilitySettings(availabilitySettings, restaurantId, input)
      };
    }
  };

  public shared ({ caller }) func linkAdminToRestaurant(restaurantId : CommonTypes.RestaurantId) : async () {
    UserLib.linkAdminToRestaurant(adminLinks, caller, restaurantId);
  };

  public query ({ caller }) func getMyRestaurant() : async ?CommonTypes.RestaurantId {
    UserLib.getAdminRestaurant(adminLinks, caller)
  };
};
