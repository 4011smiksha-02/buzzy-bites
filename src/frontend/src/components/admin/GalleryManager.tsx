import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryImage } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface GalleryManagerProps {
  restaurantId: bigint;
  images: GalleryImage[];
  isLoading: boolean;
}

export function GalleryManager({
  restaurantId,
  images,
  isLoading,
}: GalleryManagerProps) {
  const { actor } = useActor(createActor);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyActor = actor as any;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Convert file to data URL for storage
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const caption = file.name.replace(/\.[^.]+$/, "");
      const order = BigInt(images.length);
      await anyActor.addGalleryImage(restaurantId, dataUrl, caption, order);
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image: GalleryImage) {
    setDeletingId(image.id);
    try {
      await anyActor.deleteGalleryImage(image.id);
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Upload button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          id="gallery-upload"
          onChange={handleUpload}
          data-ocid="gallery.dropzone"
        />
        <Button
          type="button"
          data-ocid="gallery.upload_button"
          asChild
          className="bg-primary text-primary-foreground"
          disabled={uploading}
        >
          <label htmlFor="gallery-upload" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading…" : "Upload image"}
          </label>
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WebP · max 4 MB
        </p>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div
          data-ocid="gallery.empty_state"
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-muted-foreground"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <ImageIcon className="h-5 w-5" />
          </div>
          <p className="text-sm">No gallery images yet</p>
          <p className="text-xs mt-1">Upload your first photo above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id.toString()}
              data-ocid={`gallery.item.${idx + 1}`}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted"
            >
              <img
                src={img.url}
                alt={img.caption || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-smooth group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-foreground/60 backdrop-blur-sm px-2 py-1">
                  <p className="text-xs text-white truncate">{img.caption}</p>
                </div>
              )}
              <button
                type="button"
                data-ocid={`gallery.delete_button.${idx + 1}`}
                onClick={() => handleDelete(img)}
                disabled={deletingId === img.id}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth opacity-0 group-hover:opacity-100 disabled:opacity-40"
                aria-label={`Delete ${img.caption || "image"}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {images.length} image{images.length !== 1 ? "s" : ""} in gallery
      </p>
    </div>
  );
}
