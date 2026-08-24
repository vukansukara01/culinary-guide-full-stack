"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

interface RestaurantImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export function RestaurantImage({
  src,
  alt,
  className,
  iconClassName,
}: RestaurantImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-emerald-900 to-stone-800",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white/70">
        <UtensilsCrossed className={cn("size-10", iconClassName)} />
      </div>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className="relative z-10 size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
