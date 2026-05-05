import CommonTypes "common";

module {
  public type PriceRange = { #one; #two; #three; #four };

  public type DayOfWeek = {
    #monday; #tuesday; #wednesday; #thursday; #friday; #saturday; #sunday
  };

  public type OpeningHours = {
    day : DayOfWeek;
    open : Text;  // "HH:MM"
    close : Text; // "HH:MM"
    closed : Bool;
  };

  public type Restaurant = {
    id : CommonTypes.RestaurantId;
    var name : Text;
    var description : Text;
    var cuisineType : Text;
    var neighborhood : Text;
    var priceRange : PriceRange;
    var averageRating : Float;
    var phone : Text;
    var email : Text;
    var address : Text;
    var openingHours : [OpeningHours];
  };

  public type RestaurantPublic = {
    id : CommonTypes.RestaurantId;
    name : Text;
    description : Text;
    cuisineType : Text;
    neighborhood : Text;
    priceRange : PriceRange;
    averageRating : Float;
    phone : Text;
    email : Text;
    address : Text;
    openingHours : [OpeningHours];
  };

  public type RestaurantInput = {
    name : Text;
    description : Text;
    cuisineType : Text;
    neighborhood : Text;
    priceRange : PriceRange;
    phone : Text;
    email : Text;
    address : Text;
    openingHours : [OpeningHours];
  };

  public type SortField = { #rating; #name };

  public type SearchFilter = {
    nameQuery : ?Text;
    cuisineType : ?Text;
    neighborhood : ?Text;
    priceRange : ?PriceRange;
    sortBy : ?SortField;
  };

  public type AvailabilitySettings = {
    restaurantId : CommonTypes.RestaurantId;
    var maxCoversPerService : Nat;
    var availableTimeSlots : [Text];
    var maxPartySize : Nat;
    var bookingLeadTimeDays : Nat;
  };

  public type AvailabilitySettingsPublic = {
    restaurantId : CommonTypes.RestaurantId;
    maxCoversPerService : Nat;
    availableTimeSlots : [Text];
    maxPartySize : Nat;
    bookingLeadTimeDays : Nat;
  };

  public type AvailabilitySettingsInput = {
    maxCoversPerService : Nat;
    availableTimeSlots : [Text];
    maxPartySize : Nat;
    bookingLeadTimeDays : Nat;
  };
};
