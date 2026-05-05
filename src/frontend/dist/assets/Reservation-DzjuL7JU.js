import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, E as Separator, g as cn, B as Button, I as Input, z as useParams, y as useNavigate, x as Skeleton } from "./index-Cccc_cne.js";
import { U as UtensilsCrossed } from "./utensils-crossed-Ccl1f59y.js";
import { M as MapPin } from "./map-pin-Dn-k73jz.js";
import { C as CalendarDays, a as Clock, U as Users, u as useCheckAvailability, b as useCreateReservation } from "./use-reservations-Di-FWm7k.js";
import { C as ChevronLeft, a as ChevronRight } from "./chevron-right-WjA5C3su.js";
import { L as Label } from "./label-C4Zb96M3.js";
import { T as Textarea } from "./textarea-DduU0vuL.js";
import { C as Check } from "./check-D-PQ3gIi.js";
import { B as Badge, S as Star } from "./badge-BQykuUXH.js";
import { a as useRestaurant } from "./use-restaurants-C480o6U2.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-R3wjTQ66.js";
import "./backend-B16RMoSg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
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
function SummaryRow({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground font-body break-words", children: value })
    ] })
  ] });
}
function BookingSummary({
  restaurant,
  date,
  time,
  guestCount,
  guestInfo
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 rounded-xl p-4 border border-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-base leading-tight", children: restaurant.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body flex items-center gap-1 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
          restaurant.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: [
          restaurant.cuisine,
          " · ",
          restaurant.priceRange
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border divide-y divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { icon: CalendarDays, label: "Date", value: formatDate(date) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { icon: Clock, label: "Time", value: time }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          icon: Users,
          label: "Party Size",
          value: `${guestCount} guest${guestCount !== 1 ? "s" : ""}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border divide-y divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { icon: Users, label: "Name", value: guestInfo.name }),
      guestInfo.specialRequests && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          icon: MessageSquare,
          label: "Special Requests",
          value: guestInfo.specialRequests
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center font-body pt-1", children: [
      "A confirmation will be sent to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: guestInfo.email })
    ] })
  ] });
}
function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function DateTimePicker({
  selectedDate,
  selectedTime,
  guestCount,
  availabilitySlots,
  isLoadingSlots,
  onDateChange,
  onTimeChange,
  onGuestCountChange
}) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [calendarMonth, setCalendarMonth] = reactExports.useState(() => {
    const base = selectedDate ? /* @__PURE__ */ new Date(`${selectedDate}T12:00:00`) : tomorrow;
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const firstDayOfMonth = new Date(calendarMonth.year, calendarMonth.month, 1);
  const lastDayOfMonth = new Date(
    calendarMonth.year,
    calendarMonth.month + 1,
    0
  );
  const startPadding = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonth = () => {
    setCalendarMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setCalendarMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const isPastMonth = calendarMonth.year < tomorrow.getFullYear() || calendarMonth.year === tomorrow.getFullYear() && calendarMonth.month <= tomorrow.getMonth() - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "block text-sm font-semibold text-foreground mb-3 font-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "inline w-4 h-4 mr-1.5 mb-0.5" }),
        "Number of Guests"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-wrap gap-2",
          "data-ocid": "reservation.guest_count",
          children: Array.from({ length: 12 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `reservation.guest.${n}`,
              onClick: () => onGuestCountChange(n),
              className: cn(
                "w-10 h-10 rounded-lg text-sm font-semibold transition-smooth border",
                guestCount === n ? "bg-primary text-primary-foreground border-primary shadow-warm" : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              ),
              children: n
            },
            n
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: prevMonth,
            disabled: isPastMonth,
            className: "h-8 w-8 p-0",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-foreground text-base", children: [
          MONTHS[calendarMonth.month],
          " ",
          calendarMonth.year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: nextMonth,
            className: "h-8 w-8 p-0",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 mb-2", children: WEEKDAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center text-xs text-muted-foreground font-semibold py-1",
          children: d
        },
        d
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-y-1", children: [
        Array.from({ length: startPadding }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, `pad-start-${String(i)}`)),
        Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateKey = formatDateKey(
            calendarMonth.year,
            calendarMonth.month,
            day
          );
          const dateObj = new Date(
            calendarMonth.year,
            calendarMonth.month,
            day
          );
          const isPast = dateObj <= today;
          const isSelected = dateKey === selectedDate;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "reservation.date_cell",
              disabled: isPast,
              onClick: () => !isPast && onDateChange(dateKey),
              className: cn(
                "mx-auto w-9 h-9 rounded-lg text-sm transition-smooth flex items-center justify-center",
                isPast && "text-muted-foreground/40 cursor-not-allowed",
                !isPast && !isSelected && "text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer",
                isSelected && "bg-primary text-primary-foreground font-semibold shadow-warm"
              ),
              children: day
            },
            day
          );
        })
      ] })
    ] }),
    selectedDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-sm font-semibold text-foreground mb-3 font-body", children: "Available Times" }),
      isLoadingSlots ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-10 bg-muted animate-pulse rounded-lg"
        },
        `slot-skeleton-${String(i)}`
      )) }) : availabilitySlots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-4 text-center bg-muted/40 rounded-lg", children: "No available times for this date. Please select another day." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-3 sm:grid-cols-4 gap-2",
          "data-ocid": "reservation.time_slots",
          children: availabilitySlots.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: !slot.available,
              "data-ocid": "reservation.time_slot",
              onClick: () => slot.available && onTimeChange(slot.time),
              className: cn(
                "h-10 rounded-lg text-sm font-medium transition-smooth border relative",
                !slot.available && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed border-border/50",
                slot.available && selectedTime !== slot.time && "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 cursor-pointer",
                slot.available && selectedTime === slot.time && "bg-primary text-primary-foreground border-primary font-semibold shadow-warm"
              ),
              children: [
                slot.time,
                slot.available && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent block" }) })
              ]
            },
            slot.time
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-accent/20 border border-accent/30 inline-block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Available" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-sm bg-muted/50 border border-border/50 inline-block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Full" })
        ] })
      ] })
    ] })
  ] });
}
function GuestInfoForm({
  values,
  errors,
  onChange
}) {
  const set = (field) => (e) => onChange({ ...values, [field]: e.target.value });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Label,
        {
          htmlFor: "guest-name",
          className: "font-body text-sm font-semibold text-foreground",
          children: [
            "Full Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "guest-name",
          "data-ocid": "reservation.name_input",
          placeholder: "e.g. James Harrison",
          value: values.name,
          onChange: set("name"),
          className: errors.name ? "border-destructive focus-visible:ring-destructive" : ""
        }
      ),
      errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive",
          "data-ocid": "reservation.name_input.field_error",
          children: errors.name
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Label,
        {
          htmlFor: "guest-email",
          className: "font-body text-sm font-semibold text-foreground",
          children: [
            "Email Address ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "guest-email",
          type: "email",
          "data-ocid": "reservation.email_input",
          placeholder: "james@example.com",
          value: values.email,
          onChange: set("email"),
          className: errors.email ? "border-destructive focus-visible:ring-destructive" : ""
        }
      ),
      errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive",
          "data-ocid": "reservation.email_input.field_error",
          children: errors.email
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Label,
        {
          htmlFor: "guest-phone",
          className: "font-body text-sm font-semibold text-foreground",
          children: [
            "Phone Number ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "guest-phone",
          type: "tel",
          "data-ocid": "reservation.phone_input",
          placeholder: "+44 7700 900000",
          value: values.phone,
          onChange: set("phone"),
          className: errors.phone ? "border-destructive focus-visible:ring-destructive" : ""
        }
      ),
      errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive",
          "data-ocid": "reservation.phone_input.field_error",
          children: errors.phone
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Label,
        {
          htmlFor: "special-requests",
          className: "font-body text-sm font-semibold text-foreground",
          children: [
            "Special Requests",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "special-requests",
          "data-ocid": "reservation.special_requests_textarea",
          placeholder: "Allergies, dietary requirements, anniversary celebrations, high chairs...",
          value: values.specialRequests,
          onChange: set("specialRequests"),
          rows: 3,
          className: "resize-none"
        }
      )
    ] })
  ] });
}
const STEPS = [
  { label: "Date & Time", description: "Choose when" },
  { label: "Your Details", description: "Guest info" },
  { label: "Confirm", description: "Review & book" }
];
function ReservationStepper({ currentStep }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-0 w-full max-w-lg mx-auto", children: STEPS.map((step, index) => {
    const stepNum = index + 1;
    const isCompleted = stepNum < currentStep;
    const isActive = stepNum === currentStep;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth",
              isCompleted && "bg-primary text-primary-foreground",
              isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
              !isCompleted && !isActive && "bg-muted text-muted-foreground border border-border"
            ),
            children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : stepNum
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-xs font-semibold font-body",
                isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
              ),
              children: step.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground hidden sm:block", children: step.description })
        ] })
      ] }),
      index < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "flex-shrink-0 h-0.5 w-8 sm:w-12 mb-6 transition-smooth",
            stepNum < currentStep ? "bg-primary" : "bg-border"
          )
        }
      )
    ] }, step.label);
  }) });
}
const SLIDE_VARIANTS = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 })
};
function RestaurantMiniCard({ restaurant }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-warm mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: restaurant.coverImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: restaurant.coverImage,
        alt: restaurant.name,
        className: "w-full h-full object-cover rounded-lg"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-5 h-5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm leading-tight truncate", children: restaurant.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
          restaurant.location
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5 py-0 h-4", children: restaurant.cuisine })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-amber-500 fill-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: (restaurant.rating ?? 0).toFixed(1) })
    ] })
  ] });
}
function Reservation() {
  const { id } = useParams({ from: "/layout/restaurants/$id/reserve" });
  const navigate = useNavigate();
  const restaurantId = reactExports.useMemo(() => BigInt(id), [id]);
  const [step, setStep] = reactExports.useState(1);
  const [direction, setDirection] = reactExports.useState(1);
  const [selectedDate, setSelectedDate] = reactExports.useState("");
  const [selectedTime, setSelectedTime] = reactExports.useState("");
  const [guestCount, setGuestCount] = reactExports.useState(2);
  const [guestInfo, setGuestInfo] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: slots = [], isLoading: isLoadingSlots } = useCheckAvailability(
    selectedDate ? restaurantId : null,
    selectedDate,
    BigInt(guestCount)
  );
  const createReservation = useCreateReservation();
  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };
  const validateStep2 = () => {
    const newErrors = {};
    if (!guestInfo.name.trim()) newErrors.name = "Full name is required";
    if (!guestInfo.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(guestInfo.email))
      newErrors.email = "Please enter a valid email";
    if (!guestInfo.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleConfirm = async () => {
    if (!restaurant) return;
    try {
      const reservation = await createReservation.mutateAsync({
        restaurantId,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        partySize: BigInt(guestCount),
        date: selectedDate,
        time: selectedTime,
        specialRequests: guestInfo.specialRequests
      });
      sessionStorage.setItem("bookingRef", reservation.referenceCode);
      navigate({
        to: "/reservation/confirmation"
      });
    } catch {
    }
  };
  if (isLoadingRestaurant) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12 max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-56 mx-auto mb-8 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 w-full rounded-xl" })
    ] });
  }
  if (!restaurant) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-12 max-w-xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Restaurant not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "link",
          onClick: () => navigate({ to: "/" }),
          className: "mt-2",
          children: "Back to Explore"
        }
      )
    ] });
  }
  const step1Valid = !!selectedDate && !!selectedTime && guestCount > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background min-h-[calc(100vh-4rem)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8 max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "reservation.back_to_restaurant_link",
          onClick: () => navigate({ to: "/restaurants/$id", params: { id } }),
          className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth mb-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
            " Back to ",
            restaurant.name
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-bold text-foreground", children: "Reserve a Table" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1", children: "Complete the steps below to secure your spot." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationStepper, { currentStep: step }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RestaurantMiniCard, { restaurant }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border shadow-warm p-5 sm:p-7 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", custom: direction, children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          custom: direction,
          variants: SLIDE_VARIANTS,
          initial: "enter",
          animate: "center",
          exit: "exit",
          transition: { duration: 0.22, ease: "easeInOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg mb-5", children: "Choose Date, Time & Guests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DateTimePicker,
              {
                selectedDate,
                selectedTime,
                guestCount,
                availabilitySlots: slots,
                isLoadingSlots,
                onDateChange: (d) => {
                  setSelectedDate(d);
                  setSelectedTime("");
                },
                onTimeChange: setSelectedTime,
                onGuestCountChange: setGuestCount
              }
            )
          ]
        },
        "step1"
      ),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          custom: direction,
          variants: SLIDE_VARIANTS,
          initial: "enter",
          animate: "center",
          exit: "exit",
          transition: { duration: 0.22, ease: "easeInOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg mb-5", children: "Your Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GuestInfoForm,
              {
                values: guestInfo,
                errors,
                onChange: setGuestInfo
              }
            )
          ]
        },
        "step2"
      ),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          custom: direction,
          variants: SLIDE_VARIANTS,
          initial: "enter",
          animate: "center",
          exit: "exit",
          transition: { duration: 0.22, ease: "easeInOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg mb-5", children: "Review & Confirm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BookingSummary,
              {
                restaurant,
                date: selectedDate,
                time: selectedTime,
                guestCount,
                guestInfo
              }
            ),
            createReservation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg",
                "data-ocid": "reservation.error_state",
                children: "Something went wrong. Please try again."
              }
            )
          ]
        },
        "step3"
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: step === 1 ? () => navigate({ to: "/restaurants/$id", params: { id } }) : goBack,
          "data-ocid": "reservation.back_button",
          className: "gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
            step === 1 ? "Cancel" : "Back"
          ]
        }
      ),
      step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => {
            if (step === 1) {
              if (step1Valid) goNext();
            } else if (step === 2) {
              if (validateStep2()) goNext();
            }
          },
          disabled: step === 1 && !step1Valid,
          "data-ocid": "reservation.next_button",
          className: "gap-1",
          children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: handleConfirm,
          disabled: createReservation.isPending,
          "data-ocid": "reservation.submit_button",
          className: "gap-2",
          children: createReservation.isPending ? "Booking..." : "Confirm Reservation"
        }
      )
    ] })
  ] }) });
}
export {
  Reservation as default
};
