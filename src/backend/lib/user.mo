import List "mo:core/List";
import Map "mo:core/Map";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import ReservationTypes "../types/reservation";
import ReservationLib "reservation";

module {
  public func toPublic(p : UserTypes.UserProfile) : UserTypes.UserProfilePublic {
    {
      userId = p.userId;
      favoriteRestaurantIds = p.favoriteRestaurantIds;
      reservationIds = p.reservationIds;
    }
  };

  public func getOrCreateProfile(
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
    userId : CommonTypes.UserId
  ) : UserTypes.UserProfilePublic {
    switch (profiles.get(userId)) {
      case (?p) toPublic(p);
      case null {
        let p : UserTypes.UserProfile = {
          userId;
          var favoriteRestaurantIds = [];
          var reservationIds = [];
        };
        profiles.add(userId, p);
        toPublic(p)
      };
    }
  };

  public func addFavoriteRestaurant(
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
    userId : CommonTypes.UserId,
    restaurantId : CommonTypes.RestaurantId
  ) : UserTypes.UserProfilePublic {
    let p = switch (profiles.get(userId)) {
      case (?p) p;
      case null {
        let newP : UserTypes.UserProfile = {
          userId;
          var favoriteRestaurantIds = [];
          var reservationIds = [];
        };
        profiles.add(userId, newP);
        newP
      };
    };
    // Only add if not already present
    if (not p.favoriteRestaurantIds.any(func(id : CommonTypes.RestaurantId) : Bool { id == restaurantId })) {
      p.favoriteRestaurantIds := p.favoriteRestaurantIds.concat([restaurantId]);
    };
    toPublic(p)
  };

  public func removeFavoriteRestaurant(
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
    userId : CommonTypes.UserId,
    restaurantId : CommonTypes.RestaurantId
  ) : UserTypes.UserProfilePublic {
    switch (profiles.get(userId)) {
      case null {
        let p : UserTypes.UserProfile = {
          userId;
          var favoriteRestaurantIds = [];
          var reservationIds = [];
        };
        profiles.add(userId, p);
        toPublic(p)
      };
      case (?p) {
        p.favoriteRestaurantIds := p.favoriteRestaurantIds.filter(
          func(id : CommonTypes.RestaurantId) : Bool { id != restaurantId }
        );
        toPublic(p)
      };
    }
  };

  public func getReservationsByPrincipal(
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
    reservations : List.List<ReservationTypes.Reservation>,
    userId : CommonTypes.UserId
  ) : [ReservationTypes.ReservationPublic] {
    switch (profiles.get(userId)) {
      case null [];
      case (?p) {
        let ids = p.reservationIds;
        reservations
          .filter(func(r) {
            ids.any(func(id : CommonTypes.ReservationId) : Bool { id == r.id })
          })
          .toArray()
          .map<ReservationTypes.Reservation, ReservationTypes.ReservationPublic>(ReservationLib.toPublic)
      };
    }
  };

  public func linkReservationToUser(
    profiles : Map.Map<CommonTypes.UserId, UserTypes.UserProfile>,
    userId : CommonTypes.UserId,
    reservationId : CommonTypes.ReservationId
  ) {
    switch (profiles.get(userId)) {
      case null {
        let p : UserTypes.UserProfile = {
          userId;
          var favoriteRestaurantIds = [];
          var reservationIds = [reservationId];
        };
        profiles.add(userId, p);
      };
      case (?p) {
        if (not p.reservationIds.any(func(id : CommonTypes.ReservationId) : Bool { id == reservationId })) {
          p.reservationIds := p.reservationIds.concat([reservationId]);
        };
      };
    }
  };

  public func getAdminRestaurant(
    adminLinks : Map.Map<CommonTypes.UserId, CommonTypes.RestaurantId>,
    adminId : CommonTypes.UserId
  ) : ?CommonTypes.RestaurantId {
    adminLinks.get(adminId)
  };

  public func linkAdminToRestaurant(
    adminLinks : Map.Map<CommonTypes.UserId, CommonTypes.RestaurantId>,
    adminId : CommonTypes.UserId,
    restaurantId : CommonTypes.RestaurantId
  ) {
    adminLinks.add(adminId, restaurantId);
  };
};
