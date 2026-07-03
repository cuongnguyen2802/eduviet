"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 5000;

export function HeroSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image src={src} alt="" fill priority={i === 0} quality={90} className="object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Ảnh nền ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
