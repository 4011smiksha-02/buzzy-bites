import CommonTypes "common";

module {
  public type MenuCategory = {
    #appetizer; #main; #dessert; #drink
  };

  public type MenuItem = {
    id : CommonTypes.MenuItemId;
    restaurantId : CommonTypes.RestaurantId;
    var category : MenuCategory;
    var name : Text;
    var description : Text;
    var price : Float;
    var imageUrl : ?Text;
  };

  public type MenuItemPublic = {
    id : CommonTypes.MenuItemId;
    restaurantId : CommonTypes.RestaurantId;
    category : MenuCategory;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : ?Text;
  };

  public type MenuItemInput = {
    restaurantId : CommonTypes.RestaurantId;
    category : MenuCategory;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : ?Text;
  };

  public type GalleryImage = {
    id : CommonTypes.GalleryImageId;
    restaurantId : CommonTypes.RestaurantId;
    var url : Text;
    var caption : Text;
    var order : Nat;
  };

  public type GalleryImagePublic = {
    id : CommonTypes.GalleryImageId;
    restaurantId : CommonTypes.RestaurantId;
    url : Text;
    caption : Text;
    order : Nat;
  };

  public type GalleryImageInput = {
    restaurantId : CommonTypes.RestaurantId;
    url : Text;
    caption : Text;
    order : Nat;
  };
};
