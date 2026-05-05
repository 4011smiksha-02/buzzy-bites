import List "mo:core/List";
import CommonTypes "../types/common";
import MenuTypes "../types/menu";

module {
  public func menuItemToPublic(item : MenuTypes.MenuItem) : MenuTypes.MenuItemPublic {
    {
      id = item.id;
      restaurantId = item.restaurantId;
      category = item.category;
      name = item.name;
      description = item.description;
      price = item.price;
      imageUrl = item.imageUrl;
    }
  };

  public func galleryImageToPublic(img : MenuTypes.GalleryImage) : MenuTypes.GalleryImagePublic {
    {
      id = img.id;
      restaurantId = img.restaurantId;
      url = img.url;
      caption = img.caption;
      order = img.order;
    }
  };

  public func getMenuItems(
    menuItems : List.List<MenuTypes.MenuItem>,
    restaurantId : CommonTypes.RestaurantId
  ) : [MenuTypes.MenuItemPublic] {
    menuItems
      .filter(func(i) { i.restaurantId == restaurantId })
      .toArray()
      .map<MenuTypes.MenuItem, MenuTypes.MenuItemPublic>(menuItemToPublic)
  };

  public func addMenuItem(
    menuItems : List.List<MenuTypes.MenuItem>,
    nextId : Nat,
    input : MenuTypes.MenuItemInput
  ) : MenuTypes.MenuItemPublic {
    let item : MenuTypes.MenuItem = {
      id = nextId;
      restaurantId = input.restaurantId;
      var category = input.category;
      var name = input.name;
      var description = input.description;
      var price = input.price;
      var imageUrl = input.imageUrl;
    };
    menuItems.add(item);
    menuItemToPublic(item)
  };

  public func updateMenuItem(
    menuItems : List.List<MenuTypes.MenuItem>,
    id : CommonTypes.MenuItemId,
    input : MenuTypes.MenuItemInput
  ) : ?MenuTypes.MenuItemPublic {
    switch (menuItems.find(func(i) { i.id == id })) {
      case null null;
      case (?item) {
        item.category := input.category;
        item.name := input.name;
        item.description := input.description;
        item.price := input.price;
        item.imageUrl := input.imageUrl;
        ?menuItemToPublic(item)
      };
    }
  };

  public func deleteMenuItem(
    menuItems : List.List<MenuTypes.MenuItem>,
    id : CommonTypes.MenuItemId
  ) : Bool {
    let sizeBefore = menuItems.size();
    let kept = menuItems.filter(func(i) { i.id != id });
    menuItems.clear();
    menuItems.append(kept);
    menuItems.size() < sizeBefore
  };

  public func getGalleryImages(
    galleryImages : List.List<MenuTypes.GalleryImage>,
    restaurantId : CommonTypes.RestaurantId
  ) : [MenuTypes.GalleryImagePublic] {
    galleryImages
      .filter(func(g) { g.restaurantId == restaurantId })
      .toArray()
      .map<MenuTypes.GalleryImage, MenuTypes.GalleryImagePublic>(galleryImageToPublic)
  };

  public func addGalleryImage(
    galleryImages : List.List<MenuTypes.GalleryImage>,
    nextId : Nat,
    input : MenuTypes.GalleryImageInput
  ) : MenuTypes.GalleryImagePublic {
    let img : MenuTypes.GalleryImage = {
      id = nextId;
      restaurantId = input.restaurantId;
      var url = input.url;
      var caption = input.caption;
      var order = input.order;
    };
    galleryImages.add(img);
    galleryImageToPublic(img)
  };

  public func updateGalleryImage(
    galleryImages : List.List<MenuTypes.GalleryImage>,
    id : CommonTypes.GalleryImageId,
    input : MenuTypes.GalleryImageInput
  ) : ?MenuTypes.GalleryImagePublic {
    switch (galleryImages.find(func(g) { g.id == id })) {
      case null null;
      case (?img) {
        img.url := input.url;
        img.caption := input.caption;
        img.order := input.order;
        ?galleryImageToPublic(img)
      };
    }
  };

  public func deleteGalleryImage(
    galleryImages : List.List<MenuTypes.GalleryImage>,
    id : CommonTypes.GalleryImageId
  ) : Bool {
    let sizeBefore = galleryImages.size();
    let kept = galleryImages.filter(func(g) { g.id != id });
    galleryImages.clear();
    galleryImages.append(kept);
    galleryImages.size() < sizeBefore
  };
};
