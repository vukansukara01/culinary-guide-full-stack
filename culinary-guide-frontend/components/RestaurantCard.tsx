import Link from "next/link";
import { MapPin, Navigation, Star } from "lucide-react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { RestaurantImage } from "@/components/RestaurantImage";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { googleMapsDirectionsUrl, hasCoordinates } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const rating =
    restaurant.averageRating != null
      ? Number(restaurant.averageRating).toFixed(1)
      : "—";

  const canNavigate = hasCoordinates(
    restaurant.latitude,
    restaurant.longitude
  );

  return (
    <Card className="h-full flex-row overflow-hidden py-0 sm:flex-col sm:py-(--card-spacing)">
      <div className="relative w-[42%] shrink-0 self-stretch sm:w-full">
        <RestaurantImage
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full min-h-[148px] w-full sm:aspect-[16/10] sm:min-h-0"
        />
        <FavoriteButton
          restaurantId={restaurant.id}
          className="absolute top-2 right-2 z-20"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="px-3 pt-3 pb-1 sm:px-(--card-spacing) sm:pt-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base leading-snug sm:text-lg">
              {restaurant.name}
            </CardTitle>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-700 sm:px-2 sm:py-1">
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-semibold">{rating}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {restaurant.reviewCount ?? 0} rec.
              </span>
            </div>
          </div>
          <CardDescription className="line-clamp-1">
            {restaurant.cuisineType}
          </CardDescription>
        </CardHeader>

        <CardContent className="hidden px-3 pb-1 sm:block sm:px-(--card-spacing)">
          <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-2">{restaurant.address}</span>
          </p>
        </CardContent>

        <CardFooter className="mt-auto flex-col gap-2 border-t-0 bg-transparent p-3 sm:flex-row sm:border-t sm:bg-muted/50 sm:p-(--card-spacing)">
          <Button
            nativeButton={false}
            render={<Link href={`/restaurant/${restaurant.id}`} />}
            className="h-10 min-h-10 w-full sm:h-8 sm:min-h-8 sm:flex-1"
          >
            Detaljnije
          </Button>
          {canNavigate ? (
            <a
              href={googleMapsDirectionsUrl(
                restaurant.latitude,
                restaurant.longitude
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 min-h-10 w-full sm:h-8 sm:min-h-8 sm:flex-1"
              )}
            >
              <Navigation className="size-3.5" />
              Navigiraj
            </a>
          ) : null}
        </CardFooter>
      </div>
    </Card>
  );
}
