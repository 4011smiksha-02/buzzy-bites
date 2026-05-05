import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Reservation, ReservationStatus } from "@/types";
import { Calendar, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "All" | "Pending" | "Confirmed" | "Cancelled" | "Completed";

function getStatusKind(status: ReservationStatus): string {
  return status.__kind__;
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const kind = getStatusKind(status);
  const variants: Record<string, string> = {
    Pending: "bg-accent/20 text-accent-foreground border-accent/40",
    Confirmed: "bg-primary/15 text-primary border-primary/30",
    Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
    Completed: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        variants[kind] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {kind}
    </span>
  );
}

interface ReservationListProps {
  reservations: Reservation[];
  isLoading: boolean;
  onSelect: (reservation: Reservation) => void;
}

export function ReservationList({
  reservations,
  isLoading,
  onSelect,
}: ReservationListProps) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        !search ||
        r.guestName.toLowerCase().includes(search.toLowerCase()) ||
        r.referenceCode.toLowerCase().includes(search.toLowerCase());
      const matchesDate = !dateFilter || r.date === dateFilter;
      const matchesStatus =
        statusFilter === "All" || getStatusKind(r.status) === statusFilter;
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [reservations, search, dateFilter, statusFilter]);

  const STATUS_OPTIONS: StatusFilter[] = [
    "All",
    "Pending",
    "Confirmed",
    "Cancelled",
    "Completed",
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="reservations.search_input"
            placeholder="Search by name or ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            type="date"
            data-ocid="reservations.date_filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40 bg-background"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              data-ocid={`reservations.filter.${s.toLowerCase()}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="reservations.empty_state"
          className="text-center py-16 text-muted-foreground font-body"
        >
          <CalendarIcon />
          <p className="mt-3 text-sm">No reservations match your filters.</p>
          {(search || dateFilter || statusFilter !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSearch("");
                setDateFilter("");
                setStatusFilter("All");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-4 px-4 py-2.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <span>Reference</span>
            <span>Guest</span>
            <span>Date / Time</span>
            <span className="text-right">Guests</span>
            <span>Status</span>
            <span />
          </div>
          {filtered.map((r, i) => (
            <button
              key={r.id.toString()}
              type="button"
              data-ocid={`reservations.item.${i + 1}`}
              className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-2 md:gap-4 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-smooth text-left"
              onClick={() => onSelect(r)}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {r.referenceCode}
              </span>
              <span className="font-body font-medium text-foreground text-sm truncate">
                {r.guestName}
              </span>
              <span className="text-sm text-muted-foreground">
                {r.date} · {r.time}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                <Users className="h-3.5 w-3.5" />
                {r.partySize.toString()}
              </span>
              <StatusBadge status={r.status} />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(r);
                }}
              >
                View
              </Button>
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {reservations.length} reservation
        {reservations.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
      <Calendar className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
