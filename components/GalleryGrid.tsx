"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export type GalleryPhoto = {
  src: string;
  alt: string;
  tag?: string;
  title?: string;
};

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? index : (index - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index === null ? index : (index + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, showPrev, showNext]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {photos.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View photo: ${photo.title ?? photo.alt}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="w-5 h-5 self-end text-white" />
              <div>
                {photo.tag && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300">
                    {photo.tag}
                  </span>
                )}
                {photo.title && (
                  <h3 className="mt-0.5 text-base font-bold text-white">{photo.title}</h3>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo preview"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <figure className="w-full max-w-5xl flex flex-col items-center gap-3 px-8 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="text-center">
              {activePhoto.title && (
                <p className="text-sm sm:text-base font-semibold text-white">
                  {activePhoto.title}
                </p>
              )}
              <p className="text-xs text-slate-300">{activePhoto.tag ?? activePhoto.alt}</p>
            </figcaption>
          </figure>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <span className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-300">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
