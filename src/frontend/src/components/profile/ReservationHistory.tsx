import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCancelReservation,
  useMyReservations,
} from "@/hooks/use-reservations";
import type { Reservation, ReservationStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { format, isFuture, parseISO } from "date-fns";
import { AlertCircle, CalendarDays, Clock, Users, XCircle } from "lucide-react";
import { useState } from "react";

function statusLabel(status: ReservationStatus): string {
  return status.__kind__;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function statusVariant(status: ReservationStatus): BadgeVariant {
  switch (status.__kind__) {
    case "Confirmed":
      return "default";
    case "Pending":
      return "secondary";
    case "Cancelled":
      return "destructive";
    case "Completed":
      return "outline";
    default:
      return "secondary";
  }
}

function isCancellable(reservation: Reservation): boolean {
  const kind = reservation.status.__kind__;
  if (kind !== "Pending" && kind !== "Confirmed") return false;
  try {
    const dateTime = parseISO(`${reservation.date}T${reservation.time}`);
    return isFuture(dateTime);
  } catch {
    return false;
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEEE, MMMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function ReservationCard({
  reservation,
  index,
}: { reservation: Reservation; index: number }) {
  const cancelMutation = useCancelReservation();
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleCancel = () => {
    cancelMutation.mutate(reservation.id, {
      onSuccess: () => setCancelOpen(false),
    });
  };

  const cancellable = isCancellable(reservation);

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-warm transition-smooth"
      data-ocid={`reservations.item.${index}`}
    >
      {/* Date pill */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
        <span className="text-xs font-body font-medium uppercase tracking-wider">
          {format(parseISO(reservation.date), "MMM")}
        </span>
        <span className="text-2xl font-display font-bold leading-none">
          {format(parseISO(reservation.date), "d")}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            to="/restaurants/$id"
            params={{ id: reservation.restaurantId.toString() }}
            className="font-display font-semibold text-foreground hover:text-primary transition-colors truncate"
            data-ocid={`reservations.restaurant_link.${index}`}
          >
            {reservation.restaurantName}
          </Link>
          <Badge
            variant={statusVariant(reservation.status)}
            className="shrink-0 font-body text-xs"
          >
            {statusLabel(reservation.status)}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-body">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(reservation.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {reservation.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {reservation.partySize.toString()} guests
          </span>
        </div>

        <p className="text-xs text-muted-foreground font-body mt-1">
          Ref:{" "}
          <span className="font-mono text-foreground/70">
            {reservation.referenceCode}
          </span>
        </p>
      </div>

      {/* Cancel action */}
      {cancellable && (
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10 font-body"
              data-ocid={`reservations.delete_button.${index}`}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="reservations.cancel_dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">
                Cancel reservation?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                Your table at <strong>{reservation.restaurantName}</strong> on{" "}
                {formatDate(reservation.date)} at {reservation.time} will be
                released. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="font-body"
                data-ocid="reservations.cancel_button"
              >
                Keep it
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                data-ocid="reservations.confirm_button"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function ReservationHistory() {
  const { data: reservations, isLoading, isError } = useMyReservations();

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="reservations.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center py-12 text-center"
        data-ocid="reservations.error_state"
      >
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="font-body text-muted-foreground">
          Failed to load reservations. Please try again.
        </p>
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div
        className="flex flex-col items-center py-16 text-center"
        data-ocid="reservations.empty_state"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <CalendarDays className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No reservations yet
        </h3>
        <p className="font-body text-muted-foreground text-sm max-w-xs">
          When you book a table, your reservations will appear here.
        </p>
        <Link to="/">
          <Button
            className="mt-6 font-body"
            data-ocid="reservations.explore_button"
          >
            Explore restaurants
          </Button>
        </Link>
      </div>
    );
  }

  // Sort: upcoming first, then past by date desc
  const now = new Date();
  const upcoming = reservations
    .filter((r) => {
      try {
        return isFuture(parseISO(`${r.date}T${r.time}`));
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = reservations
    .filter((r) => {
      try {
        return !isFuture(parseISO(`${r.date}T${r.time}`));
      } catch {
        return true;
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const sorted = [...upcoming, ...past];
  void now; // suppress unused

  return (
    <div className="space-y-3">
      {upcoming.length > 0 && (
        <p className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground pb-1">
          Upcoming ({upcoming.length})
        </p>
      )}
      {sorted.map((reservation, i) => {
        const isFirstPast = i === upcoming.length && past.length > 0;
        return (
          <div key={reservation.id.toString()}>
            {isFirstPast && (
              <p className="text-xs font-body font-semibold uppercase tracking-widest text-muted-foreground pb-1 pt-4">
                Past
              </p>
            )}
            <ReservationCard reservation={reservation} index={i + 1} />
          </div>
        );
      })}
    </div>
  );
}
