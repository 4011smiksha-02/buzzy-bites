import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { MenuItem } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { ChefHat, Edit2, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface MenuManagerProps {
  restaurantId: bigint;
  items: MenuItem[];
  isLoading: boolean;
}

type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  category: "",
};

const CATEGORIES = [
  "Starters",
  "Mains",
  "Desserts",
  "Drinks",
  "Sides",
  "Specials",
];

export function MenuManager({
  restaurantId,
  items,
  isLoading,
}: MenuManagerProps) {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: (item.price ?? 0).toString(),
      category: item.category,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price || !form.category) {
      toast.error("Please fill in name, price, and category.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await anyActor.updateMenuItem(
          editing.id,
          form.name,
          form.description,
          Number.parseFloat(form.price),
          form.category,
          editing.imageUrl,
          editing.isAvailable,
          editing.isVegetarian,
          editing.isVegan,
          editing.isGlutenFree,
        );
        toast.success("Menu item updated");
      } else {
        await anyActor.addMenuItem(
          restaurantId,
          form.name,
          form.description,
          Number.parseFloat(form.price),
          form.category,
          "",
          true,
          false,
          false,
          false,
        );
        toast.success("Menu item added");
      }
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      closeForm();
    } catch {
      toast.error("Failed to save menu item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    setDeletingId(item.id);
    try {
      await anyActor.deleteMenuItem(item.id);
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inline form */}
      {showForm && (
        <div
          data-ocid="menu.form"
          className="rounded-xl border border-border bg-muted/30 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">
              {editing ? "Edit item" : "Add new item"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="menu-name">Name *</Label>
              <Input
                id="menu-name"
                data-ocid="menu.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Beef Wellington"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="menu-price">Price (£) *</Label>
              <Input
                id="menu-price"
                data-ocid="menu.price_input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="24.50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="menu-category">Category *</Label>
              <select
                id="menu-category"
                data-ocid="menu.category_select"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="menu-description">Description</Label>
            <Textarea
              id="menu-description"
              data-ocid="menu.description_textarea"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Short description…"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="menu.save_button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Add item"}
            </Button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <Button
          type="button"
          data-ocid="menu.add_button"
          onClick={openAdd}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" /> Add menu item
        </Button>
      )}

      {/* Items grouped by category */}
      {items.length === 0 && !showForm ? (
        <div
          data-ocid="menu.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <ChefHat className="h-5 w-5" />
          </div>
          <p className="text-sm">No menu items yet. Add your first dish!</p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([category, categoryItems]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-semibold text-foreground text-sm tracking-wide">
                {category}
              </h3>
              <Separator className="flex-1" />
            </div>
            {categoryItems.map((item, idx) => (
              <div
                key={item.id.toString()}
                data-ocid={`menu.item.${idx + 1}`}
                className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 hover:shadow-warm transition-smooth"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-body font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-primary font-semibold text-sm">
                      £{(item.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    data-ocid={`menu.edit_button.${idx + 1}`}
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                    aria-label="Edit item"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`menu.delete_button.${idx + 1}`}
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth disabled:opacity-40"
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
