import { BookingSummary } from "@/components/reservation/BookingSummary";
import { DateTimePicker } from "@/components/reservation/DateTimePicker";
import {
  type GuestInfo,
  type GuestInfoErrors,
  GuestInfoForm,
} from "@/components/reservation/GuestInfoForm";
import { ReservationStepper } from "@/components/reservation/ReservationStepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCheckAvailability,
  useCreateReservation,
} from "@/hooks/use-reservations";
import { useRestaurant } from "@/hooks/use-restaurants";
import type { Restaurant } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

function RestaurantMiniCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-warm mb-6">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {restaurant.coverImage ? (
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <UtensilsCrossed className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-foreground text-sm leading-tight truncate">
          {restaurant.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <MapPin className="w-3 h-3" />
            {restaurant.location}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {restaurant.cuisine}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="text-xs font-semibold text-foreground">
          {(restaurant.rating ?? 0).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export default function Reservation() {
  const { id } = useParams({ from: "/layout/restaurants/$id/reserve" });
  const navigate = useNavigate();
  const restaurantId = useMemo(() => BigInt(id), [id]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Step 1 state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guestCount, setGuestCount] = useState(2);

  // Step 2 state
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<GuestInfoErrors>({});

  const { data: restaurant, isLoading: isLoadingRestaurant } =
    useRestaurant(restaurantId);
  const { data: slots = [], isLoading: isLoadingSlots } = useCheckAvailability(
    selectedDate ? restaurantId : null,
    selectedDate,
    BigInt(guestCount),
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

  const validateStep2 = (): boolean => {
    const newErrors: GuestInfoErrors = {};
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
        specialRequests: guestInfo.specialRequests,
      });
      // store ref in sessionStorage for Confirmation page before navigating
      sessionStorage.setItem("bookingRef", reservation.referenceCode);
      navigate({
        to: "/reservation/confirmation",
      });
    } catch {
      // error handled by mutation state
    }
  };

  if (isLoadingRestaurant) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Skeleton className="h-16 w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-56 mx-auto mb-8 rounded-lg" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <p className="text-muted-foreground font-body">Restaurant not found.</p>
        <Button
          variant="link"
          onClick={() => navigate({ to: "/" })}
          className="mt-2"
        >
          Back to Explore
        </Button>
      </div>
    );
  }

  const step1Valid = !!selectedDate && !!selectedTime && guestCount > 0;

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            data-ocid="reservation.back_to_restaurant_link"
            onClick={() => navigate({ to: "/restaurants/$id", params: { id } })}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to {restaurant.name}
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Reserve a Table
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Complete the steps below to secure your spot.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <ReservationStepper currentStep={step} />
        </div>

        {/* Restaurant mini-card */}
        <RestaurantMiniCard restaurant={restaurant} />

        {/* Step content */}
        <div className="bg-card rounded-2xl border border-border shadow-warm p-5 sm:p-7 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <h2 className="font-display font-bold text-foreground text-lg mb-5">
                  Choose Date, Time & Guests
                </h2>
                <DateTimePicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  guestCount={guestCount}
                  availabilitySlots={slots}
                  isLoadingSlots={isLoadingSlots}
                  onDateChange={(d) => {
                    setSelectedDate(d);
                    setSelectedTime("");
                  }}
                  onTimeChange={setSelectedTime}
                  onGuestCountChange={setGuestCount}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <h2 className="font-display font-bold text-foreground text-lg mb-5">
                  Your Details
                </h2>
                <GuestInfoForm
                  values={guestInfo}
                  errors={errors}
                  onChange={setGuestInfo}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <h2 className="font-display font-bold text-foreground text-lg mb-5">
                  Review & Confirm
                </h2>
                <BookingSummary
                  restaurant={restaurant}
                  date={selectedDate}
                  time={selectedTime}
                  guestCount={guestCount}
                  guestInfo={guestInfo}
                />
                {createReservation.isError && (
                  <div
                    className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg"
                    data-ocid="reservation.error_state"
                  >
                    Something went wrong. Please try again.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={
              step === 1
                ? () => navigate({ to: "/restaurants/$id", params: { id } })
                : goBack
            }
            data-ocid="reservation.back_button"
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => {
                if (step === 1) {
                  if (step1Valid) goNext();
                } else if (step === 2) {
                  if (validateStep2()) goNext();
                }
              }}
              disabled={step === 1 && !step1Valid}
              data-ocid="reservation.next_button"
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={createReservation.isPending}
              data-ocid="reservation.submit_button"
              className="gap-2"
            >
              {createReservation.isPending
                ? "Booking..."
                : "Confirm Reservation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
