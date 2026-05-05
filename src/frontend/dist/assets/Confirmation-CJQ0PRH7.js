import { c as createLucideIcon, G as useSearch, y as useNavigate, j as jsxRuntimeExports, x as Skeleton, B as Button, E as Separator, r as reactExports } from "./index-Cccc_cne.js";
import { c as useReservationByReference, C as CalendarDays, a as Clock, U as Users } from "./use-reservations-Di-FWm7k.js";
import { m as motion } from "./proxy-R3wjTQ66.js";
import { C as CircleCheck } from "./circle-check-CPrHlOUt.js";
import { U as UtensilsCrossed } from "./utensils-crossed-Ccl1f59y.js";
import { M as MapPin } from "./map-pin-Dn-k73jz.js";
import { A as ArrowLeft } from "./arrow-left-DNfIhuun.js";
import "./backend-B16RMoSg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode);
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function generateICS(reservation) {
  const [year, month, day] = reservation.date.split("-").map(Number);
  const [hours, minutes] = reservation.time.split(":").map(Number);
  const startDt = new Date(year, month - 1, day, hours, minutes);
  const endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1e3);
  const fmt = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BuzzyBites//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(startDt)}`,
    `DTEND:${fmt(endDt)}`,
    `SUMMARY:Dinner at ${reservation.restaurantName}`,
    `DESCRIPTION:Booking reference: ${reservation.referenceCode}\\nParty of ${reservation.partySize}`,
    `LOCATION:${reservation.restaurantName}`,
    `UID:${reservation.referenceCode}@buzzybites`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
function DetailRow({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-accent" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground font-body break-words", children: value })
    ] })
  ] });
}
function Confetti() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const colors = [
      "oklch(0.45 0.12 30)",
      "oklch(0.5 0.1 160)",
      "oklch(0.7 0.12 75)",
      "oklch(0.65 0.15 50)"
    ];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15
    }));
    let frame;
    let done = false;
    const animate = () => {
      if (done) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of particles) {
        if (p.y < canvas.height + 20) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      }
      if (alive > 0) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      done = true;
      cancelAnimationFrame(frame);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 w-full h-full pointer-events-none"
    }
  );
}
function Confirmation() {
  const search = useSearch({ from: "/layout/reservation/confirmation" });
  const navigate = useNavigate();
  const ref = (() => {
    const searchRef = search.ref;
    return searchRef ?? sessionStorage.getItem("bookingRef") ?? "";
  })();
  const { data: reservation, isLoading } = useReservationByReference(ref);
  const handleAddToCalendar = () => {
    if (!reservation) return;
    const ics = generateICS(reservation);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservation-${reservation.referenceCode}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (isLoading || !reservation && ref) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12 max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-2xl mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-2xl" })
    ] });
  }
  if (!reservation) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "container mx-auto px-4 py-16 max-w-lg text-center",
        "data-ocid": "confirmation.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-lg", children: "Booking not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", onClick: () => navigate({ to: "/" }), children: "Back to Explore" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background min-h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: "easeOut" },
        className: "relative bg-primary rounded-2xl p-6 text-primary-foreground overflow-hidden mb-6 shadow-warm",
        "data-ocid": "confirmation.success_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Confetti, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0.5, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: {
                  delay: 0.2,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200
                },
                className: "w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold mb-1", children: "You're confirmed!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/80 text-sm font-body", children: "Your table is reserved. See you soon." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.25, duration: 0.4 },
        className: "bg-card rounded-2xl border border-border p-5 mb-4 text-center shadow-warm",
        "data-ocid": "confirmation.reference_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-widest mb-2", children: "Booking Reference" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-display text-3xl font-bold text-primary tracking-wider",
              "data-ocid": "confirmation.reference_code",
              children: reservation.referenceCode
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-2", children: "Keep this code — you may need it to manage your booking." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35, duration: 0.4 },
        className: "bg-card rounded-2xl border border-border divide-y divide-border mb-5",
        "data-ocid": "confirmation.details_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: reservation.restaurantName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                " Reservation confirmed"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: CalendarDays,
              label: "Date",
              value: formatDate(reservation.date)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { icon: Clock, label: "Time", value: reservation.time }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: Users,
              label: "Party Size",
              value: `${Number(reservation.partySize)} guest${Number(reservation.partySize) !== 1 ? "s" : ""}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              icon: Users,
              label: "Guest Name",
              value: reservation.guestName
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.45, duration: 0.4 },
        className: "space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "w-full gap-2",
              onClick: handleAddToCalendar,
              "data-ocid": "confirmation.add_to_calendar_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                "Add to Calendar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                className: "gap-2",
                onClick: () => navigate({ to: "/" }),
                "data-ocid": "confirmation.back_to_restaurants_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                  "Explore"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "secondary",
                className: "gap-2",
                onClick: () => navigate({ to: "/profile" }),
                "data-ocid": "confirmation.view_reservations_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-4 h-4" }),
                  "My Bookings"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
export {
  Confirmation as default
};
