import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, X, x as Skeleton, y as useNavigate, I as Input, B as Button, z as useParams } from "./index-Cccc_cne.js";
import { C as ChevronLeft, a as ChevronRight } from "./chevron-right-WjA5C3su.js";
import { B as Badge, S as Star } from "./badge-BQykuUXH.js";
import { L as Label } from "./label-C4Zb96M3.js";
import { u as useCheckAvailability, C as CalendarDays, U as Users, a as Clock } from "./use-reservations-Di-FWm7k.js";
import { a as useRestaurant, b as useMenuItems, c as useGalleryImages } from "./use-restaurants-C480o6U2.js";
import { U as UtensilsCrossed } from "./utensils-crossed-Ccl1f59y.js";
import { A as ArrowLeft } from "./arrow-left-DNfIhuun.js";
import { M as MapPin } from "./map-pin-Dn-k73jz.js";
import { P as Phone, M as Mail } from "./phone-CwF4Ci4T.js";
import "./backend-B16RMoSg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M2 22 16 8", key: "60hf96" }],
  [
    "path",
    {
      d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      key: "1rdhi6"
    }
  ],
  [
    "path",
    {
      d: "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      key: "1sdzmb"
    }
  ],
  [
    "path",
    {
      d: "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
      key: "eoatbi"
    }
  ],
  ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z", key: "19rau1" }],
  [
    "path",
    {
      d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
      key: "tc8ph9"
    }
  ],
  [
    "path",
    {
      d: "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
      key: "2m8kc5"
    }
  ],
  [
    "path",
    {
      d: "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
      key: "vex3ng"
    }
  ]
];
const Wheat = createLucideIcon("wheat", __iconNode);
function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext
}) {
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );
  reactExports.useEffect(() => {
    if (currentIndex === null) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex, handleKeyDown]);
  if (currentIndex === null) return null;
  const image = images[currentIndex];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm",
      onClick: onClose,
      onKeyDown: (e) => e.stopPropagation(),
      "aria-label": "Image lightbox",
      "data-ocid": "gallery.lightbox",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative max-w-5xl w-full mx-4 flex flex-col items-center",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            role: "presentation",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: image.url,
                  alt: image.caption || `Gallery image ${currentIndex + 1}`,
                  className: "max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
                }
              ),
              image.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/70 text-sm text-center", children: image.caption }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-white/40 text-xs", children: [
                currentIndex + 1,
                " / ",
                images.length
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Previous image",
            onClick: (e) => {
              e.stopPropagation();
              onPrev();
            },
            "data-ocid": "gallery.prev_button",
            className: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Next image",
            onClick: (e) => {
              e.stopPropagation();
              onNext();
            },
            "data-ocid": "gallery.next_button",
            className: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-6 h-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Close lightbox",
            onClick: onClose,
            "data-ocid": "gallery.close_button",
            className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        )
      ]
    }
  );
}
function GalleryGrid({ images, onImageClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "gallery.grid",
      className: "columns-2 md:columns-3 gap-3 space-y-3",
      children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onImageClick(i),
          "data-ocid": `gallery.item.${i + 1}`,
          className: "block w-full break-inside-avoid overflow-hidden rounded-lg cursor-zoom-in group",
          "aria-label": img.caption || `Gallery image ${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img.url,
              alt: img.caption || `Gallery image ${i + 1}`,
              className: "w-full object-cover rounded-lg group-hover:scale-[1.03] group-hover:brightness-90 transition-smooth",
              loading: "lazy"
            }
          )
        },
        img.id.toString()
      ))
    }
  );
}
function ImageCarousel({
  images,
  altPrefix = "Restaurant",
  autoSlideMs = 4500
}) {
  const [current, setCurrent] = reactExports.useState(0);
  const [paused, setPaused] = reactExports.useState(false);
  const prev = reactExports.useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = reactExports.useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );
  reactExports.useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(next, autoSlideMs);
    return () => clearInterval(id);
  }, [paused, next, autoSlideMs, images.length]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full overflow-hidden rounded-2xl",
      style: { aspectRatio: "16/7" },
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      "data-ocid": "carousel",
      children: [
        images.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 transition-opacity duration-700",
            style: {
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src,
                  alt: `${altPrefix} ${i + 1}`,
                  className: "w-full h-full object-cover",
                  loading: i === 0 ? "eager" : "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" })
            ]
          },
          src
        )),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Previous image",
              onClick: prev,
              "data-ocid": "carousel.prev_button",
              className: "absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-smooth backdrop-blur-sm",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Next image",
              onClick: next,
              "data-ocid": "carousel.next_button",
              className: "absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-smooth backdrop-blur-sm",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2", children: images.map((_src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": `Go to image ${i + 1}`,
              onClick: () => setCurrent(i),
              "data-ocid": `carousel.dot.${i + 1}`,
              className: `rounded-full transition-smooth ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/75"}`
            },
            `dot-${i}`
          )) })
        ] })
      ]
    }
  );
}
function DietBadge({ item }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex gap-1.5", children: [
    item.isVegan && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Vegan", className: "text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "w-3.5 h-3.5" }) }),
    item.isVegetarian && !item.isVegan && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Vegetarian", className: "text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "w-3.5 h-3.5 opacity-70" }) }),
    item.isGlutenFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "Gluten-free", className: "text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wheat, { className: "w-3.5 h-3.5" }) })
  ] });
}
function MenuItemCard({ item, index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `menu.item.${index}`,
      className: "flex gap-4 py-4 border-b border-border last:border-0 group",
      children: [
        item.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-16 h-16 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: item.imageUrl,
            alt: item.name,
            className: "w-full h-full object-cover group-hover:scale-105 transition-smooth",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-sm truncate", children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DietBadge, { item }),
              !item.isAvailable && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Unavailable" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 font-semibold text-primary text-sm", children: [
              "£",
              (item.price ?? 0).toFixed(2)
            ] })
          ] }),
          item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2", children: item.description })
        ] })
      ]
    }
  );
}
function MenuSection({ category, items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `menu.section.${category.toLowerCase()}`, className: "mb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold text-foreground capitalize mb-2 pb-2 border-b-2 border-primary/20", children: category }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItemCard, { item, index: i + 1 }, item.id.toString())) })
  ] });
}
function TimeSlotPicker({
  slots,
  selected,
  onSelect,
  isLoading = false
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", "data-ocid": "slots.loading_state", children: Array.from({ length: 8 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-full" }, i)
    )) });
  }
  if (!slots.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-muted-foreground text-sm",
        "data-ocid": "slots.empty_state",
        children: "Select a date to see available time slots."
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", "data-ocid": "slots.list", children: slots.map((slot) => {
    const isAvail = slot.available;
    const isSelected = selected === slot.time;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        disabled: !isAvail,
        onClick: () => isAvail && onSelect(slot.time),
        "data-ocid": `slot.${slot.time.replace(":", "-")}`,
        "aria-pressed": isSelected,
        className: [
          "px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border",
          isSelected ? "bg-primary text-primary-foreground border-primary shadow-warm" : isAvail ? "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 cursor-pointer" : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60"
        ].join(" "),
        children: slot.time
      },
      slot.time
    );
  }) });
}
function getTodayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function ReservationWidget({ restaurant }) {
  const navigate = useNavigate();
  const [date, setDate] = reactExports.useState(getTodayStr());
  const [guests, setGuests] = reactExports.useState(2);
  const [selectedTime, setSelectedTime] = reactExports.useState(null);
  const { data: slots = [], isLoading: slotsLoading } = useCheckAvailability(
    restaurant.id,
    date,
    BigInt(guests)
  );
  function handleReserve() {
    if (!selectedTime) return;
    navigate({
      to: "/restaurants/$id/reserve",
      params: { id: restaurant.id.toString() },
      search: { date, time: selectedTime, guests: guests.toString() }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "reservation.widget",
      className: "bg-card border border-border rounded-2xl shadow-warm p-5 flex flex-col gap-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-base", children: "Reserve a Table" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
            " Date"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: date,
              min: getTodayStr(),
              onChange: (e) => {
                setDate(e.target.value);
                setSelectedTime(null);
              },
              "data-ocid": "reservation.date_input",
              className: "h-9 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
            " Guests"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Decrease guest count",
                onClick: () => setGuests((g) => Math.max(1, g - 1)),
                "data-ocid": "reservation.guests_minus",
                className: "w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-semibold",
                children: "−"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "data-ocid": "reservation.guests_count",
                className: "w-8 text-center font-semibold text-foreground",
                children: guests
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Increase guest count",
                onClick: () => setGuests((g) => Math.min(12, g + 1)),
                "data-ocid": "reservation.guests_plus",
                className: "w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-semibold",
                children: "+"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
            " Available Times"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TimeSlotPicker,
            {
              slots,
              selected: selectedTime,
              onSelect: setSelectedTime,
              isLoading: slotsLoading
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full mt-1 font-semibold",
            disabled: !selectedTime,
            onClick: handleReserve,
            "data-ocid": "reservation.submit_button",
            children: "Reserve a Table"
          }
        ),
        !selectedTime && slots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center -mt-2", children: "Select a time slot to continue" })
      ]
    }
  );
}
const AMBIENCE_IMAGES = [
  "/assets/generated/restaurant-ambience-1.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-2.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-3.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-4.dim_1200x700.jpg",
  "/assets/generated/restaurant-ambience-5.dim_1200x700.jpg"
];
const HOURS_DATA = [
  { day: "Monday", open: "12:00", close: "22:00" },
  { day: "Tuesday", open: "12:00", close: "22:00" },
  { day: "Wednesday", open: "12:00", close: "22:30" },
  { day: "Thursday", open: "12:00", close: "22:30" },
  { day: "Friday", open: "12:00", close: "23:00" },
  { day: "Saturday", open: "11:00", close: "23:00" },
  { day: "Sunday", open: "11:00", close: "21:00" }
];
function groupMenuByCategory(items) {
  const map = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  }
  return map;
}
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-amber-400 text-amber-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: (rating ?? 0).toFixed(1) })
  ] });
}
function RestaurantDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-6xl mx-auto px-4 py-6",
      "data-ocid": "restaurant.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "w-full rounded-2xl mb-6",
            style: { aspectRatio: "16/7" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 w-full rounded-2xl" })
        ] })
      ]
    }
  );
}
function RestaurantDetail() {
  var _a;
  const { id } = useParams({ from: "/layout/restaurants/$id" });
  const navigate = useNavigate();
  const restaurantId = BigInt(id);
  const { data: restaurant, isLoading: restLoading } = useRestaurant(restaurantId);
  const { data: menuItemsRaw = [], isLoading: menuLoading } = useMenuItems(restaurantId);
  const { data: galleryRaw = [], isLoading: galleryLoading } = useGalleryImages(restaurantId);
  const menuItems = menuItemsRaw;
  const galleryImages = galleryRaw;
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [lightboxIndex, setLightboxIndex] = reactExports.useState(null);
  const menuByCategory = groupMenuByCategory(menuItems);
  const categoryOrder = [
    "Appetizers",
    "Starters",
    "Mains",
    "Pasta",
    "Desserts",
    "Drinks"
  ];
  const sortedCategories = Object.keys(menuByCategory).sort(
    (a, b) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
  );
  const carouselImages = galleryImages.length > 0 ? galleryImages.slice(0, 5).map((g) => g.url) : AMBIENCE_IMAGES;
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long" });
  if (restLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantDetailSkeleton, {});
  if (!restaurant) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-12 h-12 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Restaurant not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/" }),
          "data-ocid": "restaurant.back_link",
          className: "text-primary underline text-sm hover:text-primary/80 transition-smooth",
          children: "Back to explore"
        }
      )
    ] });
  }
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    {
      key: "gallery",
      label: `Gallery${galleryImages.length ? ` (${galleryImages.length})` : ""}`
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background", "data-ocid": "restaurant.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/" }),
        "data-ocid": "restaurant.back_button",
        className: "flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-5 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          " Back to restaurants"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCarousel, { images: carouselImages, altPrefix: restaurant.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "capitalize text-xs", children: restaurant.cuisine }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: restaurant.priceRange }),
            (_a = restaurant.features) == null ? void 0 : _a.slice(0, 2).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs border-accent/30 text-accent",
                children: f
              },
              f
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground mb-2", children: restaurant.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: restaurant.rating }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Number(restaurant.reviewCount).toLocaleString(),
              " reviews"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
              restaurant.location
            ] })
          ] }),
          restaurant.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground leading-relaxed", children: restaurant.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b border-border mb-6 gap-1",
            role: "tablist",
            "data-ocid": "restaurant.tabs",
            children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": activeTab === tab.key,
                onClick: () => setActiveTab(tab.key),
                "data-ocid": `restaurant.tab.${tab.key}`,
                className: [
                  "px-4 py-2.5 text-sm font-medium transition-smooth border-b-2 -mb-px",
                  activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                ].join(" "),
                children: tab.label
              },
              tab.key
            ))
          }
        ),
        activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "restaurant.overview_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-44 rounded-xl bg-muted overflow-hidden mb-6 flex items-center justify-center border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: restaurant.address })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-3", children: "Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: HOURS_DATA.map(({ day, open, close }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: [
                    "flex justify-between text-sm py-1 border-b border-border/50",
                    day === today ? "font-semibold text-foreground" : "text-muted-foreground"
                  ].join(" "),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: day }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      open,
                      " – ",
                      close
                    ] })
                  ]
                },
                day
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-3", children: "Contact & Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                restaurant.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: restaurant.address })
                ] }),
                restaurant.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `tel:${restaurant.phone}`,
                    className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 shrink-0" }),
                      restaurant.phone
                    ]
                  }
                ),
                restaurant.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `mailto:${restaurant.email}`,
                    className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 shrink-0" }),
                      restaurant.email
                    ]
                  }
                ),
                restaurant.website && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: restaurant.website,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 shrink-0" }),
                      restaurant.website.replace(/^https?:\/\//, "")
                    ]
                  }
                ),
                restaurant.openingHours && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 shrink-0" }),
                  restaurant.openingHours
                ] })
              ] })
            ] })
          ] })
        ] }),
        activeTab === "menu" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "restaurant.menu_tab", children: menuLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-ocid": "menu.loading_state", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32 mb-3" }),
          [1, 2, 3].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full mb-2" }, m))
        ] }, n)) }) : sortedCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-3 py-16",
            "data-ocid": "menu.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-10 h-10 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No menu items available yet." })
            ]
          }
        ) : sortedCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenuSection,
          {
            category: cat,
            items: menuByCategory[cat]
          },
          cat
        )) }),
        activeTab === "gallery" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "restaurant.gallery_tab", children: [
          galleryLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "columns-2 md:columns-3 gap-3 space-y-3",
              "data-ocid": "gallery.loading_state",
              children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: "w-full h-40 rounded-lg break-inside-avoid"
                },
                `skeleton-${i}`
              ))
            }
          ) : galleryImages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex flex-col items-center gap-3 py-16",
              "data-ocid": "gallery.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No gallery images yet." })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            GalleryGrid,
            {
              images: galleryImages,
              onImageClick: (i) => setLightboxIndex(i)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GalleryLightbox,
            {
              images: galleryImages,
              currentIndex: lightboxIndex,
              onClose: () => setLightboxIndex(null),
              onPrev: () => setLightboxIndex(
                (idx) => idx === null ? null : (idx - 1 + galleryImages.length) % galleryImages.length
              ),
              onNext: () => setLightboxIndex(
                (idx) => idx === null ? null : (idx + 1) % galleryImages.length
              )
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationWidget, { restaurant }) }) })
    ] })
  ] }) });
}
export {
  RestaurantDetail as default
};
