import { Skeleton } from "@/components/ui/skeleton";
import type { AvailabilitySlot } from "@/types";

interface TimeSlotPickerProps {
  slots: AvailabilitySlot[];
  selected: string | null;
  onSelect: (time: string) => void;
  isLoading?: boolean;
}

export function TimeSlotPicker({
  slots,
  selected,
  onSelect,
  isLoading = false,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2" data-ocid="slots.loading_state">
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <Skeleton key={i} className="h-8 w-16 rounded-full" />
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return (
      <p
        className="text-muted-foreground text-sm"
        data-ocid="slots.empty_state"
      >
        Select a date to see available time slots.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" data-ocid="slots.list">
      {slots.map((slot) => {
        const isAvail = slot.available;
        const isSelected = selected === slot.time;
        return (
          <button
            key={slot.time}
            type="button"
            disabled={!isAvail}
            onClick={() => isAvail && onSelect(slot.time)}
            data-ocid={`slot.${slot.time.replace(":", "-")}`}
            aria-pressed={isSelected}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-warm"
                : isAvail
                  ? "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 cursor-pointer"
                  : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
