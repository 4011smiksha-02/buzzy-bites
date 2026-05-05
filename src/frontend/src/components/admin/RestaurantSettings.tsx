import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Restaurant } from "@/types";
import type { AvailabilitySettings } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const CUISINES = [
  "Italian",
  "Japanese",
  "French",
  "Modern European",
  "Indian",
  "Mediterranean",
  "American",
  "Chinese",
  "Mexican",
  "Thai",
];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface RestaurantSettingsProps {
  restaurant: Restaurant | null;
  availability: AvailabilitySettings | null;
  isCreate?: boolean;
  onCreated?: () => void;
}

export function RestaurantSettings({
  restaurant,
  availability,
  isCreate,
  onCreated,
}: RestaurantSettingsProps) {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: restaurant?.name ?? "",
    description: restaurant?.description ?? "",
    cuisine: restaurant?.cuisine ?? "",
    neighborhood: restaurant?.location ?? "",
    address: restaurant?.address ?? "",
    priceRange: restaurant?.priceRange ?? "$$",
    phone: restaurant?.phone ?? "",
    openTime: availability?.openTime ?? "09:00",
    closeTime: availability?.closeTime ?? "22:00",
    daysOpen: availability?.daysOpen ?? [1, 2, 3, 4, 5],
  });
  const [saving, setSaving] = useState(false);

  function field(key: keyof typeof form) {
    return {
      value: form[key] as string,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function toggleDay(day: number) {
    setForm((f) => ({
      ...f,
      daysOpen: f.daysOpen.includes(day)
        ? f.daysOpen.filter((d) => d !== day)
        : [...f.daysOpen, day].sort(),
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Restaurant name is required.");
      return;
    }
    setSaving(true);
    try {
      if (isCreate) {
        await anyActor.createRestaurant(
          form.name,
          form.description,
          form.cuisine,
          form.neighborhood,
          form.address,
          form.priceRange,
          form.phone,
          "",
          "",
          "",
        );
        queryClient.invalidateQueries({ queryKey: ["adminRestaurant"] });
        toast.success("Restaurant created!");
        onCreated?.();
      } else if (restaurant) {
        await anyActor.updateRestaurant(
          restaurant.id,
          form.name,
          form.description,
          form.cuisine,
          form.neighborhood,
          form.address,
          form.priceRange,
          form.phone,
          restaurant.email,
          restaurant.website,
          restaurant.coverImage,
        );
        await anyActor.updateAvailabilitySettings(
          restaurant.id,
          form.openTime,
          form.closeTime,
          BigInt(60),
          BigInt(20),
          form.daysOpen,
        );
        queryClient.invalidateQueries({ queryKey: ["adminRestaurant"] });
        toast.success("Settings saved!");
      }
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <section className="space-y-4">
        <h3 className="font-display font-semibold text-foreground">
          Basic information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="rs-name">Restaurant name *</Label>
            <Input
              id="rs-name"
              data-ocid="settings.name_input"
              {...field("name")}
              placeholder="The Oak Room"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="rs-desc">Description</Label>
            <Textarea
              id="rs-desc"
              data-ocid="settings.description_textarea"
              {...field("description")}
              placeholder="A short description of your restaurant…"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rs-cuisine">Cuisine type</Label>
            <select
              id="rs-cuisine"
              data-ocid="settings.cuisine_select"
              value={form.cuisine}
              onChange={(e) =>
                setForm((f) => ({ ...f, cuisine: e.target.value }))
              }
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select cuisine…</option>
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rs-price">Price range</Label>
            <select
              id="rs-price"
              data-ocid="settings.price_select"
              value={form.priceRange}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  priceRange: e.target.value as import("@/types").PriceRange,
                }))
              }
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PRICE_RANGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rs-neighborhood">Neighborhood</Label>
            <Input
              id="rs-neighborhood"
              data-ocid="settings.neighborhood_input"
              {...field("neighborhood")}
              placeholder="Mayfair"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rs-phone">Phone</Label>
            <Input
              id="rs-phone"
              data-ocid="settings.phone_input"
              {...field("phone")}
              placeholder="+44 20 1234 5678"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="rs-address">Address</Label>
            <Input
              id="rs-address"
              data-ocid="settings.address_input"
              {...field("address")}
              placeholder="12 Park Lane, London W1K 1AA"
            />
          </div>
        </div>
      </section>

      {!isCreate && (
        <>
          <Separator />
          {/* Availability */}
          <section className="space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Opening hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rs-open">Opens at</Label>
                <Input
                  id="rs-open"
                  data-ocid="settings.open_time_input"
                  type="time"
                  {...field("openTime")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rs-close">Closes at</Label>
                <Input
                  id="rs-close"
                  data-ocid="settings.close_time_input"
                  type="time"
                  {...field("closeTime")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Open days</Label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day, i) => {
                  const dayNum = i + 1;
                  const active = form.daysOpen.includes(dayNum);
                  return (
                    <button
                      key={day}
                      type="button"
                      data-ocid={`settings.day_toggle.${day.toLowerCase()}`}
                      onClick={() => toggleDay(dayNum)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          data-ocid="settings.save_button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground min-w-[120px]"
        >
          {saving
            ? "Saving…"
            : isCreate
              ? "Create restaurant"
              : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
