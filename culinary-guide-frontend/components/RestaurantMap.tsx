import { ExternalLink, Navigation } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
  googleMapsPlaceUrl,
  parseCoordinates,
} from "@/lib/maps";
import { cn } from "@/lib/utils";

interface RestaurantMapProps {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
}

export function RestaurantMap({
  name,
  latitude,
  longitude,
  className,
}: RestaurantMapProps) {
  const coords = parseCoordinates(latitude, longitude);

  if (!coords) {
    return (
      <div
        className={cn(
          "rounded-2xl border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground",
          className
        )}
      >
        Lokacija za ovaj restoran nije dostupna.
      </div>
    );
  }

  const directionsUrl = googleMapsDirectionsUrl(coords.latitude, coords.longitude);
  const placeUrl = googleMapsPlaceUrl(coords.latitude, coords.longitude, name);
  const embedUrl = googleMapsEmbedUrl(coords.latitude, coords.longitude);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="-mx-4 overflow-hidden border-y bg-muted sm:mx-0 sm:rounded-2xl sm:border">
        <iframe
          title={`Mapa — ${name}`}
          src={embedUrl}
          className="h-[220px] w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 min-h-12 bg-emerald-800 text-white hover:bg-emerald-800/90 sm:h-9 sm:min-h-9 sm:flex-1"
          )}
        >
          <Navigation className="size-4" />
          Navigiraj
        </a>
        <a
          href={placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 min-h-12 sm:h-9 sm:min-h-9 sm:flex-1"
          )}
        >
          <ExternalLink className="size-4" />
          Otvori na mapi
        </a>
      </div>
    </div>
  );
}
