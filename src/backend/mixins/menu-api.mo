import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import MenuTypes "../types/menu";
import UserTypes "../types/user";
import MenuLib "../lib/menu";
import UserLib "../lib/user";

mixin (
  menuItems : List.List<MenuTypes.MenuItem>,
  galleryImages : List.List<MenuTypes.GalleryImage>,
  adminLinks : Map.Map<CommonTypes.UserId, CommonTypes.RestaurantId>,
  nextMenuItemId : CommonTypes.Counter,
  nextGalleryImageId : CommonTypes.Counter
) {
  // Public browse
  public query func getMenuItems(restaurantId : CommonTypes.RestaurantId) : async [MenuTypes.MenuItemPublic] {
    MenuLib.getMenuItems(menuItems, restaurantId)
  };

  public query func getGalleryImages(restaurantId : CommonTypes.RestaurantId) : async [MenuTypes.GalleryImagePublic] {
    MenuLib.getGalleryImages(galleryImages, restaurantId)
  };

  // Admin management
  public shared ({ caller }) func addMenuItem(input : MenuTypes.MenuItemInput) : async MenuTypes.MenuItemPublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?adminRestaurantId) {
        if (adminRestaurantId != input.restaurantId) Runtime.trap("Not authorized for this restaurant");
        let result = MenuLib.addMenuItem(menuItems, nextMenuItemId.val, input);
        nextMenuItemId.val += 1;
        result
      };
    }
  };

  public shared ({ caller }) func updateMenuItem(id : CommonTypes.MenuItemId, input : MenuTypes.MenuItemInput) : async ?MenuTypes.MenuItemPublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?_) MenuLib.updateMenuItem(menuItems, id, input);
    }
  };

  public shared ({ caller }) func deleteMenuItem(id : CommonTypes.MenuItemId) : async Bool {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?_) MenuLib.deleteMenuItem(menuItems, id);
    }
  };

  public shared ({ caller }) func addGalleryImage(input : MenuTypes.GalleryImageInput) : async MenuTypes.GalleryImagePublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?adminRestaurantId) {
        if (adminRestaurantId != input.restaurantId) Runtime.trap("Not authorized for this restaurant");
        let result = MenuLib.addGalleryImage(galleryImages, nextGalleryImageId.val, input);
        nextGalleryImageId.val += 1;
        result
      };
    }
  };

  public shared ({ caller }) func updateGalleryImage(id : CommonTypes.GalleryImageId, input : MenuTypes.GalleryImageInput) : async ?MenuTypes.GalleryImagePublic {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?_) MenuLib.updateGalleryImage(galleryImages, id, input);
    }
  };

  public shared ({ caller }) func deleteGalleryImage(id : CommonTypes.GalleryImageId) : async Bool {
    switch (UserLib.getAdminRestaurant(adminLinks, caller)) {
      case null Runtime.trap("Not an admin");
      case (?_) MenuLib.deleteGalleryImage(galleryImages, id);
    }
  };
};
