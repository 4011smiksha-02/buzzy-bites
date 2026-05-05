import type { GalleryImage } from "@/types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (currentIndex === null) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex, handleKeyDown]);

  if (currentIndex === null) return null;

  const image = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => e.stopPropagation()}
      aria-label="Image lightbox"
      data-ocid="gallery.lightbox"
    >
      {/* Main image */}
      <div
        className="relative max-w-5xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <img
          src={image.url}
          alt={image.caption || `Gallery image ${currentIndex + 1}`}
          className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        {image.caption && (
          <p className="mt-3 text-white/70 text-sm text-center">
            {image.caption}
          </p>
        )}
        <p className="mt-1 text-white/40 text-xs">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Nav arrows */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        data-ocid="gallery.prev_button"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        data-ocid="gallery.next_button"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Close */}
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        data-ocid="gallery.close_button"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-smooth"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div
      data-ocid="gallery.grid"
      className="columns-2 md:columns-3 gap-3 space-y-3"
    >
      {images.map((img, i) => (
        <button
          key={img.id.toString()}
          type="button"
          onClick={() => onImageClick(i)}
          data-ocid={`gallery.item.${i + 1}`}
          className="block w-full break-inside-avoid overflow-hidden rounded-lg cursor-zoom-in group"
          aria-label={img.caption || `Gallery image ${i + 1}`}
        >
          <img
            src={img.url}
            alt={img.caption || `Gallery image ${i + 1}`}
            className="w-full object-cover rounded-lg group-hover:scale-[1.03] group-hover:brightness-90 transition-smooth"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}
