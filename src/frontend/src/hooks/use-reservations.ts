import { createActor } from "@/backend";
import type {
  AvailabilitySlot,
  CreateReservationInput,
  Reservation,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCheckAvailability(
  restaurantId: bigint | null,
  date: string,
  partySize: bigint,
) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<AvailabilitySlot[]>({
    queryKey: [
      "availability",
      restaurantId?.toString(),
      date,
      partySize.toString(),
    ],
    queryFn: async () => {
      if (!anyActor || restaurantId === null || !date) return [];
      const result = await anyActor.checkAvailability(
        restaurantId,
        date,
        partySize,
      );
      return result as AvailabilitySlot[];
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null && !!date,
  });
}

export function useCreateReservation() {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReservationInput) => {
      if (!anyActor) throw new Error("Not connected");
      const result = await anyActor.createReservation(
        input.restaurantId,
        input.guestName,
        input.guestEmail,
        input.guestPhone,
        input.partySize,
        input.date,
        input.time,
        input.specialRequests,
      );
      return result as Reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
    },
  });
}

export function useReservationByReference(referenceCode: string) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Reservation | null>({
    queryKey: ["reservation", referenceCode],
    queryFn: async () => {
      if (!anyActor || !referenceCode) return null;
      const result = await anyActor.getReservationByReference(referenceCode);
      const r = result as { __kind__: string; value?: unknown };
      if (r.__kind__ === "Some" && r.value) return r.value as Reservation;
      return null;
    },
    enabled: !!anyActor && !isFetching && !!referenceCode,
  });
}

export function useMyReservations() {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Reservation[]>({
    queryKey: ["myReservations"],
    queryFn: async () => {
      if (!anyActor) return [];
      const result = await anyActor.getMyReservations();
      return result as Reservation[];
    },
    enabled: !!anyActor && !isFetching,
  });
}

export function useAdminReservations(restaurantId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;

  return useQuery<Reservation[]>({
    queryKey: ["adminReservations", restaurantId?.toString()],
    queryFn: async () => {
      if (!anyActor || restaurantId === null) return [];
      const result = await anyActor.getReservationsByRestaurant(restaurantId);
      return result as Reservation[];
    },
    enabled: !!anyActor && !isFetching && restaurantId !== null,
  });
}

export function useCancelReservation() {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: bigint) => {
      if (!anyActor) throw new Error("Not connected");
      return anyActor.cancelReservation(reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
      queryClient.invalidateQueries({ queryKey: ["adminReservations"] });
    },
  });
}

export function useConfirmReservation() {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: bigint) => {
      if (!anyActor) throw new Error("Not connected");
      return anyActor.confirmReservation(reservationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReservations"] });
    },
  });
}
