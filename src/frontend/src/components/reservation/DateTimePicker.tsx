import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AvailabilitySlot } from "@/types";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useState } from "react";

interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  guestCount: number;
  availabilitySlots: AvailabilitySlot[];
  isLoadingSlots: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onGuestCountChange: (count: number) => void;
}

function formatDateKey(year: number, month: number, day: number): string {
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
  "December",
];

export function DateTimePicker({
  selectedDate,
  selectedTime,
  guestCount,
  availabilitySlots,
  isLoadingSlots,
  onDateChange,
  onTimeChange,
  onGuestCountChange,
}: DateTimePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const base = selectedDate ? new Date(`${selectedDate}T12:00:00`) : tomorrow;
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const firstDayOfMonth = new Date(calendarMonth.year, calendarMonth.month, 1);
  const lastDayOfMonth = new Date(
    calendarMonth.year,
    calendarMonth.month + 1,
    0,
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

  const isPastMonth =
    calendarMonth.year < tomorrow.getFullYear() ||
    (calendarMonth.year === tomorrow.getFullYear() &&
      calendarMonth.month <= tomorrow.getMonth() - 1);

  return (
    <div className="space-y-6">
      {/* Guest count */}
      <div>
        <p className="block text-sm font-semibold text-foreground mb-3 font-body">
          <Users className="inline w-4 h-4 mr-1.5 mb-0.5" />
          Number of Guests
        </p>
        <div
          className="flex flex-wrap gap-2"
          data-ocid="reservation.guest_count"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              data-ocid={`reservation.guest.${n}`}
              onClick={() => onGuestCountChange(n)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-semibold transition-smooth border",
                guestCount === n
                  ? "bg-primary text-primary-foreground border-primary shadow-warm"
                  : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            disabled={isPastMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-display font-semibold text-foreground text-base">
            {MONTHS[calendarMonth.month]} {calendarMonth.year}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs text-muted-foreground font-semibold py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: startPadding }, (_, i) => (
            <div key={`pad-start-${String(i)}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = formatDateKey(
              calendarMonth.year,
              calendarMonth.month,
              day,
            );
            const dateObj = new Date(
              calendarMonth.year,
              calendarMonth.month,
              day,
            );
            const isPast = dateObj <= today;
            const isSelected = dateKey === selectedDate;
            return (
              <button
                key={day}
                type="button"
                data-ocid="reservation.date_cell"
                disabled={isPast}
                onClick={() => !isPast && onDateChange(dateKey)}
                className={cn(
                  "mx-auto w-9 h-9 rounded-lg text-sm transition-smooth flex items-center justify-center",
                  isPast && "text-muted-foreground/40 cursor-not-allowed",
                  !isPast &&
                    !isSelected &&
                    "text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer",
                  isSelected &&
                    "bg-primary text-primary-foreground font-semibold shadow-warm",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="block text-sm font-semibold text-foreground mb-3 font-body">
            Available Times
          </p>
          {isLoadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`slot-skeleton-${String(i)}`}
                  className="h-10 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : availabilitySlots.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center bg-muted/40 rounded-lg">
              No available times for this date. Please select another day.
            </p>
          ) : (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 gap-2"
              data-ocid="reservation.time_slots"
            >
              {availabilitySlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  data-ocid="reservation.time_slot"
                  onClick={() => slot.available && onTimeChange(slot.time)}
                  className={cn(
                    "h-10 rounded-lg text-sm font-medium transition-smooth border relative",
                    !slot.available &&
                      "bg-muted/50 text-muted-foreground/50 cursor-not-allowed border-border/50",
                    slot.available &&
                      selectedTime !== slot.time &&
                      "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 cursor-pointer",
                    slot.available &&
                      selectedTime === slot.time &&
                      "bg-primary text-primary-foreground border-primary font-semibold shadow-warm",
                  )}
                >
                  {slot.time}
                  {slot.available && (
                    <span className="absolute top-0.5 right-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent block" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent/20 border border-accent/30 inline-block" />
              <span className="text-xs text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-muted/50 border border-border/50 inline-block" />
              <span className="text-xs text-muted-foreground">Full</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
