import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import CommonTypes "../types/common";
import RestaurantTypes "../types/restaurant";

module {
  public func toPublic(r : RestaurantTypes.Restaurant) : RestaurantTypes.RestaurantPublic {
    {
      id = r.id;
      name = r.name;
      description = r.description;
      cuisineType = r.cuisineType;
      neighborhood = r.neighborhood;
      priceRange = r.priceRange;
      averageRating = r.averageRating;
      phone = r.phone;
      email = r.email;
      address = r.address;
      openingHours = r.openingHours;
    }
  };

  public func searchRestaurants(
    restaurants : List.List<RestaurantTypes.Restaurant>,
    filter : RestaurantTypes.SearchFilter
  ) : [RestaurantTypes.RestaurantPublic] {
    let results = restaurants.filter(func(r) {
      let nameMatch = switch (filter.nameQuery) {
        case null true;
        case (?q) r.name.toLower().contains(#text (q.toLower()));
      };
      let cuisineMatch = switch (filter.cuisineType) {
        case null true;
        case (?c) r.cuisineType.toLower() == c.toLower();
      };
      let neighborhoodMatch = switch (filter.neighborhood) {
        case null true;
        case (?n) r.neighborhood.toLower() == n.toLower();
      };
      let priceMatch = switch (filter.priceRange) {
        case null true;
        case (?p) r.priceRange == p;
      };
      nameMatch and cuisineMatch and neighborhoodMatch and priceMatch
    });

    let arr = results.toArray();
    let sorted = switch (filter.sortBy) {
      case (?(#rating)) {
        arr.sort(func(a, b) {
          if (a.averageRating > b.averageRating) #less
          else if (a.averageRating < b.averageRating) #greater
          else #equal
        })
      };
      case (?(#name)) {
        arr.sort(func(a, b) { Text.compare(a.name, b.name) })
      };
      case null arr;
    };
    sorted.map<RestaurantTypes.Restaurant, RestaurantTypes.RestaurantPublic>(toPublic)
  };

  public func getRestaurant(
    restaurants : List.List<RestaurantTypes.Restaurant>,
    id : CommonTypes.RestaurantId
  ) : ?RestaurantTypes.RestaurantPublic {
    switch (restaurants.find(func(r) { r.id == id })) {
      case (?r) ?toPublic(r);
      case null null;
    }
  };

  public func createRestaurant(
    restaurants : List.List<RestaurantTypes.Restaurant>,
    nextId : Nat,
    input : RestaurantTypes.RestaurantInput
  ) : RestaurantTypes.RestaurantPublic {
    let r : RestaurantTypes.Restaurant = {
      id = nextId;
      var name = input.name;
      var description = input.description;
      var cuisineType = input.cuisineType;
      var neighborhood = input.neighborhood;
      var priceRange = input.priceRange;
      var averageRating = 0.0;
      var phone = input.phone;
      var email = input.email;
      var address = input.address;
      var openingHours = input.openingHours;
    };
    restaurants.add(r);
    toPublic(r)
  };

  public func updateRestaurant(
    restaurants : List.List<RestaurantTypes.Restaurant>,
    id : CommonTypes.RestaurantId,
    input : RestaurantTypes.RestaurantInput
  ) : ?RestaurantTypes.RestaurantPublic {
    switch (restaurants.find(func(r) { r.id == id })) {
      case null null;
      case (?r) {
        r.name := input.name;
        r.description := input.description;
        r.cuisineType := input.cuisineType;
        r.neighborhood := input.neighborhood;
        r.priceRange := input.priceRange;
        r.phone := input.phone;
        r.email := input.email;
        r.address := input.address;
        r.openingHours := input.openingHours;
        ?toPublic(r)
      };
    }
  };

  public func getAvailabilitySettings(
    settingsMap : Map.Map<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>,
    restaurantId : CommonTypes.RestaurantId
  ) : ?RestaurantTypes.AvailabilitySettingsPublic {
    switch (settingsMap.get(restaurantId)) {
      case null null;
      case (?s) ?{
        restaurantId = s.restaurantId;
        maxCoversPerService = s.maxCoversPerService;
        availableTimeSlots = s.availableTimeSlots;
        maxPartySize = s.maxPartySize;
        bookingLeadTimeDays = s.bookingLeadTimeDays;
      };
    }
  };

  public func upsertAvailabilitySettings(
    settingsMap : Map.Map<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>,
    restaurantId : CommonTypes.RestaurantId,
    input : RestaurantTypes.AvailabilitySettingsInput
  ) : RestaurantTypes.AvailabilitySettingsPublic {
    switch (settingsMap.get(restaurantId)) {
      case (?s) {
        s.maxCoversPerService := input.maxCoversPerService;
        s.availableTimeSlots := input.availableTimeSlots;
        s.maxPartySize := input.maxPartySize;
        s.bookingLeadTimeDays := input.bookingLeadTimeDays;
        {
          restaurantId;
          maxCoversPerService = s.maxCoversPerService;
          availableTimeSlots = s.availableTimeSlots;
          maxPartySize = s.maxPartySize;
          bookingLeadTimeDays = s.bookingLeadTimeDays;
        }
      };
      case null {
        let s : RestaurantTypes.AvailabilitySettings = {
          restaurantId;
          var maxCoversPerService = input.maxCoversPerService;
          var availableTimeSlots = input.availableTimeSlots;
          var maxPartySize = input.maxPartySize;
          var bookingLeadTimeDays = input.bookingLeadTimeDays;
        };
        settingsMap.add(restaurantId, s);
        {
          restaurantId;
          maxCoversPerService = s.maxCoversPerService;
          availableTimeSlots = s.availableTimeSlots;
          maxPartySize = s.maxPartySize;
          bookingLeadTimeDays = s.bookingLeadTimeDays;
        }
      };
    }
  };
};
