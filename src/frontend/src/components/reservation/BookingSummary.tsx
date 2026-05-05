import { Separator } from "@/components/ui/separator";
import type { Restaurant } from "@/types";
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { GuestInfo } from "./GuestInfoForm";

interface BookingSummaryProps {
  restaurant: Restaurant;
  date: string;
  time: string;
  guestCount: number;
  guestInfo: GuestInfo;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-body">{label}</p>
        <p className="text-sm font-semibold text-foreground font-body break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export function BookingSummary({
  restaurant,
  date,
  time,
  guestCount,
  guestInfo,
}: BookingSummaryProps) {
  return (
    <div className="space-y-2">
      {/* Restaurant */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/15">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-foreground text-base leading-tight">
              {restaurant.name}
            </p>
            <p className="text-sm text-muted-foreground font-body flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {restaurant.location}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {restaurant.cuisine} · {restaurant.priceRange}
            </p>
          </div>
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        <SummaryRow icon={CalendarDays} label="Date" value={formatDate(date)} />
        <SummaryRow icon={Clock} label="Time" value={time} />
        <SummaryRow
          icon={Users}
          label="Party Size"
          value={`${guestCount} guest${guestCount !== 1 ? "s" : ""}`}
        />
      </div>

      <Separator className="my-1" />

      {/* Guest info */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        <SummaryRow icon={Users} label="Name" value={guestInfo.name} />
        {guestInfo.specialRequests && (
          <SummaryRow
            icon={MessageSquare}
            label="Special Requests"
            value={guestInfo.specialRequests}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center font-body pt-1">
        A confirmation will be sent to{" "}
        <strong className="text-foreground">{guestInfo.email}</strong>
      </p>
    </div>
  );
}
