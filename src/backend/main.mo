import List "mo:core/List";
import Map "mo:core/Map";
import RestaurantTypes "types/restaurant";
import MenuTypes "types/menu";
import ReservationTypes "types/reservation";
import UserTypes "types/user";
import CommonTypes "types/common";
import RestaurantApi "mixins/restaurant-api";
import MenuApi "mixins/menu-api";
import ReservationApi "mixins/reservation-api";
import UserApi "mixins/user-api";
import RestaurantLib "lib/restaurant";
import MenuLib "lib/menu";

actor {
  // ── Counters ─────────────────────────────────────────────────────────
  let nextRestaurantId = CommonTypes.newCounter();
  let nextMenuItemId = CommonTypes.newCounter();
  let nextGalleryImageId = CommonTypes.newCounter();
  let nextReservationId = CommonTypes.newCounter();
  var sampleDataLoaded : Bool = false;

  // ── State ────────────────────────────────────────────────────────────
  let restaurants = List.empty<RestaurantTypes.Restaurant>();
  let availabilitySettings = Map.empty<CommonTypes.RestaurantId, RestaurantTypes.AvailabilitySettings>();
  let menuItems = List.empty<MenuTypes.MenuItem>();
  let galleryImages = List.empty<MenuTypes.GalleryImage>();
  let reservations = List.empty<ReservationTypes.Reservation>();
  let userProfiles = Map.empty<CommonTypes.UserId, UserTypes.UserProfile>();
  let adminLinks = Map.empty<CommonTypes.UserId, CommonTypes.RestaurantId>();

  // ── Mixins ───────────────────────────────────────────────────────────
  include RestaurantApi(restaurants, availabilitySettings, adminLinks, nextRestaurantId);
  include MenuApi(menuItems, galleryImages, adminLinks, nextMenuItemId, nextGalleryImageId);
  include ReservationApi(reservations, availabilitySettings, adminLinks, userProfiles, nextReservationId);
  include UserApi(userProfiles, reservations);

  // ── Sample Data ───────────────────────────────────────────────────────
  func loadSampleData() {
    // 6 sample restaurants
    let sampleRestaurants : [RestaurantTypes.RestaurantInput] = [
      {
        name = "La Dolce Vita";
        description = "Authentic Italian cuisine in the heart of the city. Family recipes passed down for generations, featuring handmade pasta and wood-fired pizzas.";
        cuisineType = "Italian";
        neighborhood = "Little Italy";
        priceRange = #two;
        phone = "+1-555-0101";
        email = "info@ladolcevita.com";
        address = "123 Via Roma, Little Italy";
        openingHours = [
          { day = #monday; open = "12:00"; close = "22:00"; closed = false },
          { day = #tuesday; open = "12:00"; close = "22:00"; closed = false },
          { day = #wednesday; open = "12:00"; close = "22:00"; closed = false },
          { day = #thursday; open = "12:00"; close = "22:00"; closed = false },
          { day = #friday; open = "12:00"; close = "23:00"; closed = false },
          { day = #saturday; open = "11:00"; close = "23:00"; closed = false },
          { day = #sunday; open = "11:00"; close = "21:00"; closed = false },
        ];
      },
      {
        name = "Sakura Garden";
        description = "Traditional Japanese dining experience featuring fresh sushi, sashimi, and an extensive sake collection. Serene garden-inspired atmosphere.";
        cuisineType = "Japanese";
        neighborhood = "Midtown";
        priceRange = #three;
        phone = "+1-555-0202";
        email = "reservations@sakuragarden.com";
        address = "456 Cherry Blossom Ave, Midtown";
        openingHours = [
          { day = #monday; open = "11:30"; close = "21:30"; closed = false },
          { day = #tuesday; open = "11:30"; close = "21:30"; closed = false },
          { day = #wednesday; open = "11:30"; close = "21:30"; closed = false },
          { day = #thursday; open = "11:30"; close = "21:30"; closed = false },
          { day = #friday; open = "11:30"; close = "22:30"; closed = false },
          { day = #saturday; open = "12:00"; close = "22:30"; closed = false },
          { day = #sunday; open = "12:00"; close = "20:30"; closed = false },
        ];
      },
      {
        name = "El Rancho";
        description = "Vibrant Mexican cantina bursting with flavor. Enjoy our famous street tacos, handcrafted margaritas, and festive atmosphere.";
        cuisineType = "Mexican";
        neighborhood = "Downtown";
        priceRange = #one;
        phone = "+1-555-0303";
        email = "hola@elrancho.com";
        address = "789 Fiesta Blvd, Downtown";
        openingHours = [
          { day = #monday; open = "11:00"; close = "22:00"; closed = false },
          { day = #tuesday; open = "11:00"; close = "22:00"; closed = false },
          { day = #wednesday; open = "11:00"; close = "22:00"; closed = false },
          { day = #thursday; open = "11:00"; close = "22:00"; closed = false },
          { day = #friday; open = "11:00"; close = "23:30"; closed = false },
          { day = #saturday; open = "10:00"; close = "23:30"; closed = false },
          { day = #sunday; open = "10:00"; close = "21:00"; closed = false },
        ];
      },
      {
        name = "Maison Lumière";
        description = "Refined French cuisine in an elegant setting. Award-winning chef curates seasonal menus inspired by the French Riviera.";
        cuisineType = "French";
        neighborhood = "Uptown";
        priceRange = #four;
        phone = "+1-555-0404";
        email = "contact@maisonlumiere.com";
        address = "12 Rue du Soleil, Uptown";
        openingHours = [
          { day = #monday; open = "00:00"; close = "00:00"; closed = true },
          { day = #tuesday; open = "18:00"; close = "22:00"; closed = false },
          { day = #wednesday; open = "18:00"; close = "22:00"; closed = false },
          { day = #thursday; open = "18:00"; close = "22:00"; closed = false },
          { day = #friday; open = "18:00"; close = "23:00"; closed = false },
          { day = #saturday; open = "17:00"; close = "23:00"; closed = false },
          { day = #sunday; open = "17:00"; close = "21:00"; closed = false },
        ];
      },
      {
        name = "Spice Route";
        description = "Journey through the flavors of India. From aromatic biryanis to rich curries, experience the full spectrum of Indian culinary heritage.";
        cuisineType = "Indian";
        neighborhood = "East Side";
        priceRange = #two;
        phone = "+1-555-0505";
        email = "namaste@spiceroute.com";
        address = "321 Masala Street, East Side";
        openingHours = [
          { day = #monday; open = "12:00"; close = "22:00"; closed = false },
          { day = #tuesday; open = "12:00"; close = "22:00"; closed = false },
          { day = #wednesday; open = "12:00"; close = "22:00"; closed = false },
          { day = #thursday; open = "12:00"; close = "22:00"; closed = false },
          { day = #friday; open = "12:00"; close = "23:00"; closed = false },
          { day = #saturday; open = "12:00"; close = "23:00"; closed = false },
          { day = #sunday; open = "12:00"; close = "21:30"; closed = false },
        ];
      },
      {
        name = "The Smokehouse";
        description = "Classic American BBQ with slow-smoked meats, craft beers, and Southern sides. A neighborhood institution for over 20 years.";
        cuisineType = "American";
        neighborhood = "West End";
        priceRange = #two;
        phone = "+1-555-0606";
        email = "bbq@thesmokehouse.com";
        address = "654 Grill Master Lane, West End";
        openingHours = [
          { day = #monday; open = "00:00"; close = "00:00"; closed = true },
          { day = #tuesday; open = "11:00"; close = "21:30"; closed = false },
          { day = #wednesday; open = "11:00"; close = "21:30"; closed = false },
          { day = #thursday; open = "11:00"; close = "21:30"; closed = false },
          { day = #friday; open = "11:00"; close = "22:30"; closed = false },
          { day = #saturday; open = "11:00"; close = "22:30"; closed = false },
          { day = #sunday; open = "11:00"; close = "20:00"; closed = false },
        ];
      },
    ];

    // Create restaurants and availability settings
    let baseId = nextRestaurantId.val;
    for (input in sampleRestaurants.values()) {
      ignore RestaurantLib.createRestaurant(restaurants, nextRestaurantId.val, input);
      let settings : RestaurantTypes.AvailabilitySettings = {
        restaurantId = nextRestaurantId.val;
        var maxCoversPerService = 40;
        var availableTimeSlots = ["12:00", "14:00", "19:00", "20:30", "21:00"];
        var maxPartySize = 10;
        var bookingLeadTimeDays = 30;
      };
      availabilitySettings.add(nextRestaurantId.val, settings);
      nextRestaurantId.val += 1;
    };

    // Menu items per restaurant
    let allMenuItems : [MenuTypes.MenuItemInput] = [
      // La Dolce Vita (id=0) - Italian
      { restaurantId = baseId + 0; category = #appetizer; name = "Bruschetta al Pomodoro"; description = "Toasted bread with fresh tomatoes, garlic, and basil"; price = 8.50; imageUrl = null },
      { restaurantId = baseId + 0; category = #appetizer; name = "Arancini"; description = "Crispy risotto balls filled with mozzarella and meat ragu"; price = 10.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #main; name = "Tagliatelle al Ragù"; description = "Handmade pasta with slow-cooked Bolognese sauce"; price = 18.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #main; name = "Pizza Margherita"; description = "Wood-fired pizza with San Marzano tomatoes and fresh mozzarella"; price = 16.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #main; name = "Osso Buco"; description = "Braised veal shank with gremolata and saffron risotto"; price = 28.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #dessert; name = "Tiramisu"; description = "Classic Italian dessert with espresso-soaked ladyfingers"; price = 9.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #dessert; name = "Panna Cotta"; description = "Silky vanilla cream with mixed berry coulis"; price = 8.00; imageUrl = null },
      { restaurantId = baseId + 0; category = #drink; name = "Aperol Spritz"; description = "Aperol, Prosecco, and soda water"; price = 12.00; imageUrl = null },
      // Sakura Garden (id=1) - Japanese
      { restaurantId = baseId + 1; category = #appetizer; name = "Edamame"; description = "Steamed soybeans with sea salt"; price = 6.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #appetizer; name = "Gyoza"; description = "Pan-fried pork and cabbage dumplings with dipping sauce"; price = 9.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #main; name = "Salmon Nigiri (8pc)"; description = "Premium Atlantic salmon over seasoned sushi rice"; price = 22.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #main; name = "Tonkotsu Ramen"; description = "Rich pork bone broth with chashu, soft egg, and nori"; price = 18.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #main; name = "Beef Teriyaki"; description = "Grilled beef with teriyaki glaze, rice, and seasonal vegetables"; price = 24.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #dessert; name = "Mochi Ice Cream"; description = "Assorted mochi with green tea, strawberry, and mango"; price = 8.00; imageUrl = null },
      { restaurantId = baseId + 1; category = #drink; name = "Premium Sake"; description = "Chilled Junmai Daiginjo sake"; price = 15.00; imageUrl = null },
      // El Rancho (id=2) - Mexican
      { restaurantId = baseId + 2; category = #appetizer; name = "Guacamole & Chips"; description = "Fresh avocado guacamole with house-made tortilla chips"; price = 9.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #appetizer; name = "Queso Fundido"; description = "Melted cheese with chorizo and roasted peppers"; price = 10.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #main; name = "Al Pastor Tacos (3pc)"; description = "Slow-roasted pork with pineapple, cilantro, and onion"; price = 14.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #main; name = "Chicken Enchiladas"; description = "Corn tortillas stuffed with chicken in red mole sauce"; price = 16.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #main; name = "Carnitas Burrito"; description = "Slow-cooked pork with rice, beans, and salsa"; price = 13.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #dessert; name = "Churros con Chocolate"; description = "Fried dough dusted with cinnamon sugar and chocolate dipping sauce"; price = 7.00; imageUrl = null },
      { restaurantId = baseId + 2; category = #drink; name = "Classic Margarita"; description = "Tequila, fresh lime juice, and triple sec on the rocks"; price = 11.00; imageUrl = null },
      // Maison Lumière (id=3) - French
      { restaurantId = baseId + 3; category = #appetizer; name = "Foie Gras Torchon"; description = "House-cured duck foie gras with brioche and Sauternes jelly"; price = 28.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #appetizer; name = "Soupe à l'Oignon"; description = "Classic French onion soup with Gruyère crouton"; price = 14.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #main; name = "Duck Confit"; description = "Slow-cooked duck leg with lentils du Puy and Dijon jus"; price = 38.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #main; name = "Bouillabaisse"; description = "Traditional Provençal seafood stew with rouille and crusty bread"; price = 42.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #main; name = "Filet de Bœuf"; description = "Tenderloin with truffle butter, pommes dauphinoise, and haricots verts"; price = 52.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #dessert; name = "Crème Brûlée"; description = "Vanilla custard with caramelized sugar crust"; price = 12.00; imageUrl = null },
      { restaurantId = baseId + 3; category = #drink; name = "Château Margaux"; description = "Premier Grand Cru Classé, Bordeaux"; price = 85.00; imageUrl = null },
      // Spice Route (id=4) - Indian
      { restaurantId = baseId + 4; category = #appetizer; name = "Samosa Chaat"; description = "Crispy samosas with chickpea curry, tamarind, and yogurt"; price = 9.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #appetizer; name = "Seekh Kebab"; description = "Spiced minced lamb skewers with mint chutney"; price = 13.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #main; name = "Butter Chicken"; description = "Tender chicken in creamy tomato-based masala sauce"; price = 19.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #main; name = "Lamb Biryani"; description = "Fragrant basmati rice slow-cooked with spiced lamb"; price = 22.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #main; name = "Paneer Makhani"; description = "Cottage cheese in rich tomato-cream sauce, vegetarian"; price = 17.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #dessert; name = "Gulab Jamun"; description = "Milk-solid dumplings soaked in rose-scented syrup"; price = 7.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #drink; name = "Mango Lassi"; description = "Chilled yogurt drink blended with Alphonso mangoes"; price = 6.00; imageUrl = null },
      { restaurantId = baseId + 4; category = #drink; name = "Masala Chai"; description = "Spiced tea brewed with cardamom, ginger, and cinnamon"; price = 4.00; imageUrl = null },
      // The Smokehouse (id=5) - American
      { restaurantId = baseId + 5; category = #appetizer; name = "Smoked Wings"; description = "Hickory-smoked chicken wings with house BBQ sauce"; price = 13.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #appetizer; name = "Loaded Fries"; description = "Crispy fries with pulled pork, cheese sauce, and jalapeños"; price = 11.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #main; name = "Brisket Platter"; description = "12-hour smoked beef brisket with coleslaw and cornbread"; price = 26.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #main; name = "Pulled Pork Sandwich"; description = "Slow-smoked pork shoulder on a brioche bun with pickles"; price = 17.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #main; name = "Smokehouse Burger"; description = "Double patty with smoked cheddar, bacon, and onion jam"; price = 19.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #dessert; name = "Banana Pudding"; description = "Homemade vanilla custard with Nilla wafers and fresh banana"; price = 8.00; imageUrl = null },
      { restaurantId = baseId + 5; category = #drink; name = "Craft IPA"; description = "Local craft India Pale Ale, rotating selection"; price = 7.00; imageUrl = null },
    ];

    for (item in allMenuItems.values()) {
      ignore MenuLib.addMenuItem(menuItems, nextMenuItemId.val, item);
      nextMenuItemId.val += 1;
    };

    sampleDataLoaded := true;
  };

  // Load sample data on init
  loadSampleData();
};
