import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckAvailability } from "@/hooks/use-reservations";
import type { Restaurant } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock, Users } from "lucide-react";
import { useState } from "react";
import { TimeSlotPicker } from "./TimeSlotPicker";

interface ReservationWidgetProps {
  restaurant: Restaurant;
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export function ReservationWidget({ restaurant }: ReservationWidgetProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState(getTodayStr());
  const [guests, setGuests] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: slots = [], isLoading: slotsLoading } = useCheckAvailability(
    restaurant.id,
    date,
    BigInt(guests),
  );

  function handleReserve() {
    if (!selectedTime) return;
    navigate({
      to: "/restaurants/$id/reserve",
      params: { id: restaurant.id.toString() },
      search: { date, time: selectedTime, guests: guests.toString() },
    });
  }

  return (
    <div
      data-ocid="reservation.widget"
      className="bg-card border border-border rounded-2xl shadow-warm p-5 flex flex-col gap-4"
    >
      <h3 className="font-display font-bold text-foreground text-base">
        Reserve a Table
      </h3>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" /> Date
        </Label>
        <Input
          type="date"
          value={date}
          min={getTodayStr()}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedTime(null);
          }}
          data-ocid="reservation.date_input"
          className="h-9 text-sm"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> Guests
        </Label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Decrease guest count"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            data-ocid="reservation.guests_minus"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-semibold"
          >
            −
          </button>
          <span
            data-ocid="reservation.guests_count"
            className="w-8 text-center font-semibold text-foreground"
          >
            {guests}
          </span>
          <button
            type="button"
            aria-label="Increase guest count"
            onClick={() => setGuests((g) => Math.min(12, g + 1))}
            data-ocid="reservation.guests_plus"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-smooth font-semibold"
          >
            +
          </button>
        </div>
      </div>

      {/* Time slots */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Available Times
        </Label>
        <TimeSlotPicker
          slots={slots}
          selected={selectedTime}
          onSelect={setSelectedTime}
          isLoading={slotsLoading}
        />
      </div>

      {/* CTA */}
      <Button
        className="w-full mt-1 font-semibold"
        disabled={!selectedTime}
        onClick={handleReserve}
        data-ocid="reservation.submit_button"
      >
        Reserve a Table
      </Button>

      {!selectedTime && slots.length > 0 && (
        <p className="text-xs text-muted-foreground text-center -mt-2">
          Select a time slot to continue
        </p>
      )}
    </div>
  );
}
