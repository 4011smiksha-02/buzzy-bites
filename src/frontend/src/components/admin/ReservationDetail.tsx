import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  useCancelReservation,
  useConfirmReservation,
} from "@/hooks/use-reservations";
import type { Reservation } from "@/types";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReservationDetailProps {
  reservation: Reservation | null;
  onClose: () => void;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-body">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ReservationDetail({
  reservation,
  onClose,
}: ReservationDetailProps) {
  const [confirmAction, setConfirmAction] = useState<
    "confirm" | "cancel" | null
  >(null);
  const confirm = useConfirmReservation();
  const cancel = useCancelReservation();

  if (!reservation) return null;

  const statusKind = reservation.status.__kind__;
  const isPending = statusKind === "Pending";
  const isConfirmed = statusKind === "Confirmed";

  async function handleAction(action: "confirm" | "cancel") {
    if (!reservation) return;
    try {
      if (action === "confirm") {
        await confirm.mutateAsync(reservation.id);
        toast.success("Reservation confirmed");
      } else {
        await cancel.mutateAsync(reservation.id);
        toast.success("Reservation cancelled");
      }
      setConfirmAction(null);
      onClose();
    } catch {
      toast.error("Action failed. Please try again.");
    }
  }

  const isLoading = confirm.isPending || cancel.isPending;

  return (
    <>
      <Dialog open={!!reservation} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          data-ocid="reservations.dialog"
          className="max-w-md bg-card"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">
              Reservation Details
            </DialogTitle>
            <p className="font-mono text-xs text-muted-foreground">
              {reservation.referenceCode}
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-muted-foreground">
                Status:
              </span>
              <StatusPill kind={statusKind} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                icon={Calendar}
                label="Date"
                value={reservation.date}
              />
              <DetailRow icon={Clock} label="Time" value={reservation.time} />
              <DetailRow
                icon={Users}
                label="Party size"
                value={`${reservation.partySize} guest${reservation.partySize > 1n ? "s" : ""}`}
              />
            </div>
            <Separator />
            <DetailRow
              icon={Users}
              label="Guest name"
              value={reservation.guestName}
            />
            <DetailRow
              icon={Mail}
              label="Email"
              value={reservation.guestEmail}
            />
            {reservation.guestPhone && (
              <DetailRow
                icon={Phone}
                label="Phone"
                value={reservation.guestPhone}
              />
            )}
            {reservation.specialRequests && (
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground font-body mb-1">
                  Special requests
                </p>
                <p className="text-sm text-foreground">
                  {reservation.specialRequests}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              data-ocid="reservations.close_button"
              onClick={onClose}
            >
              Close
            </Button>
            {isPending && (
              <Button
                type="button"
                data-ocid="reservations.confirm_button"
                onClick={() => setConfirmAction("confirm")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                Confirm booking
              </Button>
            )}
            {(isPending || isConfirmed) && (
              <Button
                type="button"
                variant="destructive"
                data-ocid="reservations.cancel_button"
                onClick={() => setConfirmAction("cancel")}
                disabled={isLoading}
              >
                Cancel booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation prompt */}
      <Dialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent
          data-ocid="reservations.confirm_dialog"
          className="max-w-sm bg-card"
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <DialogTitle className="font-display text-base">
                {confirmAction === "confirm"
                  ? "Confirm reservation?"
                  : "Cancel reservation?"}
              </DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              {confirmAction === "confirm"
                ? "This will confirm the booking and notify the guest."
                : "This will cancel the booking. The guest will be notified."}
            </p>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="reservations.confirm_dialog.cancel_button"
              onClick={() => setConfirmAction(null)}
              disabled={isLoading}
            >
              Go back
            </Button>
            <Button
              type="button"
              data-ocid="reservations.confirm_dialog.confirm_button"
              onClick={() => confirmAction && handleAction(confirmAction)}
              disabled={isLoading}
              variant={confirmAction === "cancel" ? "destructive" : "default"}
              className={
                confirmAction === "confirm"
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : ""
              }
            >
              {isLoading
                ? "Processing…"
                : confirmAction === "confirm"
                  ? "Yes, confirm"
                  : "Yes, cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusPill({ kind }: { kind: string }) {
  const variants: Record<string, string> = {
    Pending: "bg-accent/20 text-accent-foreground border-accent/40",
    Confirmed: "bg-primary/15 text-primary border-primary/30",
    Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
    Completed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[kind] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {kind}
    </span>
  );
}
