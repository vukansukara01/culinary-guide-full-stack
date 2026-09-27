import Link from "next/link";
import { MapPin, Navigation, Star } from "lucide-react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { RestaurantImage } from "@/components/RestaurantImage";
import { buttonVariants } from "@/components/ui/button";
import { googleMapsDirectionsUrl, hasCoordinates } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  /** Prve above-the-fold slike — LCP (bez lazy, fetchpriority=high) */
  priority?: boolean;
}

export function RestaurantCard({
  restaurant,
  priority = false,
}: RestaurantCardProps) {
  const rating =
    restaurant.averageRating != null
      ? Number(restaurant.averageRating).toFixed(1)
      : "—";

  const canNavigate = hasCoordinates(
    restaurant.latitude,
    restaurant.longitude
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <RestaurantImage
          src={restaurant.imageUrl}
          alt={restaurant.name}
          variant="card"
          priority={priority}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
        {restaurant.cuisineType ? (
          <span className="absolute top-3 left-3 rounded-sm bg-background px-2 py-0.5 text-xs font-medium tracking-wide text-foreground uppercase shadow-sm">
            {restaurant.cuisineType}
          </span>
        ) : null}
        <FavoriteButton
          restaurantId={restaurant.id}
          className="absolute top-2.5 right-2.5 z-20"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-1 text-white">
          <Star
            className="size-3.5 fill-amber-300 text-amber-300"
            aria-hidden
          />
          <span className="text-sm font-semibold tabular-nums">{rating}</span>
          <span className="text-xs text-white">
            ({restaurant.reviewCount ?? 0})
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading line-clamp-2 text-lg leading-snug">
            <Link
              href={`/restaurant/${restaurant.id}`}
              className="hover:text-primary"
            >
              {restaurant.name}
            </Link>
          </h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-2">{restaurant.address}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/restaurant/${restaurant.id}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-9 min-h-9 flex-1"
            )}
          >
            Detaljnije
          </Link>
          {canNavigate ? (
            <a
              href={googleMapsDirectionsUrl(
                restaurant.latitude,
                restaurant.longitude
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 min-h-9 flex-1"
              )}
            >
              <Navigation className="size-3.5" />
              Navigiraj
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
