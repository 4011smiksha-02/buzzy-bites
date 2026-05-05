import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useReservationByReference } from "@/hooks/use-reservations";
import type { Reservation } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  List,
  MapPin,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

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

function generateICS(reservation: Reservation): string {
  const [year, month, day] = reservation.date.split("-").map(Number);
  const [hours, minutes] = reservation.time.split(":").map(Number);
  const startDt = new Date(year, month - 1, day, hours, minutes);
  const endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;

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
    "END:VCALENDAR",
  ].join("\r\n");
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-accent" />
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

/* ---- Confetti ---- */
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotSpeed: number;
    };
    const colors = [
      "oklch(0.45 0.12 30)",
      "oklch(0.5 0.1 160)",
      "oklch(0.7 0.12 75)",
      "oklch(0.65 0.15 50)",
    ];
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
    }));

    let frame: number;
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function Confirmation() {
  const search = useSearch({ from: "/layout/reservation/confirmation" });
  const navigate = useNavigate();
  const ref = (() => {
    const searchRef = (search as Record<string, string>).ref;
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

  if (isLoading || (!reservation && ref)) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Skeleton className="h-32 w-full rounded-2xl mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div
        className="container mx-auto px-4 py-16 max-w-lg text-center"
        data-ocid="confirmation.error_state"
      >
        <p className="text-muted-foreground font-body text-lg">
          Booking not found.
        </p>
        <Button className="mt-4" onClick={() => navigate({ to: "/" })}>
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative bg-primary rounded-2xl p-6 text-primary-foreground overflow-hidden mb-6 shadow-warm"
          data-ocid="confirmation.success_banner"
        >
          <Confetti />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.4,
                type: "spring",
                stiffness: 200,
              }}
              className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold mb-1">
              You&apos;re confirmed!
            </h1>
            <p className="text-primary-foreground/80 text-sm font-body">
              Your table is reserved. See you soon.
            </p>
          </div>
        </motion.div>

        {/* Reference code */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5 mb-4 text-center shadow-warm"
          data-ocid="confirmation.reference_card"
        >
          <p className="text-xs text-muted-foreground font-body uppercase tracking-widest mb-2">
            Booking Reference
          </p>
          <p
            className="font-display text-3xl font-bold text-primary tracking-wider"
            data-ocid="confirmation.reference_code"
          >
            {reservation.referenceCode}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-2">
            Keep this code — you may need it to manage your booking.
          </p>
        </motion.div>

        {/* Booking details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border divide-y divide-border mb-5"
          data-ocid="confirmation.details_card"
        >
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground">
                {reservation.restaurantName}
              </p>
              <p className="text-xs text-muted-foreground font-body flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> Reservation confirmed
              </p>
            </div>
          </div>
          <Separator />
          <DetailRow
            icon={CalendarDays}
            label="Date"
            value={formatDate(reservation.date)}
          />
          <DetailRow icon={Clock} label="Time" value={reservation.time} />
          <DetailRow
            icon={Users}
            label="Party Size"
            value={`${Number(reservation.partySize)} guest${Number(reservation.partySize) !== 1 ? "s" : ""}`}
          />
          <DetailRow
            icon={Users}
            label="Guest Name"
            value={reservation.guestName}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="space-y-3"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleAddToCalendar}
            data-ocid="confirmation.add_to_calendar_button"
          >
            <Download className="w-4 h-4" />
            Add to Calendar
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              onClick={() => navigate({ to: "/" })}
              data-ocid="confirmation.back_to_restaurants_link"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => navigate({ to: "/profile" })}
              data-ocid="confirmation.view_reservations_link"
            >
              <List className="w-4 h-4" />
              My Bookings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
