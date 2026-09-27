"use client";

import { useState } from "react";
import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";

import { resolveImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type ImageVariant = "card" | "hero";

interface RestaurantImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
  /** card = lista (manje), hero = detalj stranica */
  variant?: ImageVariant;
  priority?: boolean;
}

const VARIANT_CONFIG: Record<
  ImageVariant,
  { maxWidth: number; sizes: string; quality: number }
> = {
  card: {
    // Kartica je ~160–380px široka — ne vuči veće od toga sa Googlea
    maxWidth: 360,
    sizes: "(max-width: 640px) 160px, (max-width: 1024px) 45vw, 360px",
    quality: 50,
  },
  hero: {
    maxWidth: 800,
    sizes: "(max-width: 768px) 100vw, 800px",
    quality: 65,
  },
};

export function RestaurantImage({
  src,
  alt,
  className,
  iconClassName,
  variant = "card",
  priority = false,
}: RestaurantImageProps) {
  const [failed, setFailed] = useState(false);
  const config = VARIANT_CONFIG[variant];
  const resolved = resolveImageUrl(src, { maxWidth: config.maxWidth });
  const showImage = Boolean(resolved) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/80 to-foreground/70",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white/70">
        <UtensilsCrossed className={cn("size-10", iconClassName)} />
      </div>
      {showImage ? (
        <Image
          src={resolved!}
          alt={alt}
          fill
          sizes={config.sizes}
          quality={config.quality}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="z-10 object-cover"
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
