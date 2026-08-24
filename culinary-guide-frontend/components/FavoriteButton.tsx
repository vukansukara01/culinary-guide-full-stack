"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  restaurantId: number;
  variant?: "overlay" | "button";
  className?: string;
}

export function FavoriteButton({
  restaurantId,
  variant = "overlay",
  className,
}: FavoriteButtonProps) {
  const pathname = usePathname();
  const { isAuthenticated, isReady: authReady } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [error, setError] = useState<string | null>(null);

  const favorited = isFavorite(restaurantId);
  const loginHref = `/login?redirect=${encodeURIComponent(pathname || "/")}`;

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    try {
      await toggleFavorite(restaurantId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nije moguće sačuvati restoran."
      );
    }
  }

  const label = favorited ? "Ukloni iz favorita" : "Sačuvaj restoran";

  const heart = (
    <Heart
      className={cn(
        "size-5 transition-colors",
        favorited ? "fill-rose-500 text-rose-500" : "fill-transparent"
      )}
    />
  );

  if (authReady && !isAuthenticated) {
    if (variant === "button") {
      return (
        <Link
          href={loginHref}
          className={cn(
            "inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted",
            className
          )}
        >
          <Heart className="size-4" />
          Sačuvaj
        </Link>
      );
    }

    return (
      <Link
        href={loginHref}
        aria-label="Prijavite se da sačuvate restoran"
        title="Prijavite se da sačuvate restoran"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur-sm hover:bg-white",
          className
        )}
      >
        <Heart className="size-5" />
      </Link>
    );
  }

  if (variant === "button") {
    return (
      <div className={cn("flex flex-col items-stretch gap-1", className)}>
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={favorited}
          aria-label={label}
          className={cn(
            "inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
            favorited
              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              : "border-border bg-background hover:bg-muted"
          )}
        >
          {heart}
          {favorited ? "Sačuvano" : "Sačuvaj"}
        </button>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={favorited}
      aria-label={label}
      title={error ?? label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur-sm hover:bg-white",
        className
      )}
    >
      {heart}
    </button>
  );
}
