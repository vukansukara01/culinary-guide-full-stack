"use client";

import { useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";

import { RestaurantCard } from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNearbyRestaurants } from "@/lib/api";
import type { Restaurant } from "@/types";

const RADIUS_OPTIONS = [
  { value: "0.5", label: "0.5 km" },
  { value: "1", label: "1 km" },
  { value: "5", label: "5 km" },
];

export default function NearbyPage() {
  const [radius, setRadius] = useState("1");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  async function findNearbyRestaurants() {
    setError(null);
    setIsLoading(true);
    setHasSearched(true);

    if (!navigator.geolocation) {
      setError("Vaš pregledač ne podržava geolokaciju.");
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCoords({ latitude, longitude });

      const results = await getNearbyRestaurants({
        latitude,
        longitude,
        radius: Number(radius),
      });

      setRestaurants(results);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Pristup lokaciji je odbijen. Omogućite geolokaciju u podešavanjima pregledača."
          );
        } else {
          setError("Nije moguće odrediti vašu lokaciju. Pokušajte ponovo.");
        }
      } else {
        setError(
          "Došlo je do greške pri pretrazi. Provjerite da li je backend pokrenut."
        );
      }
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 max-w-2xl space-y-2 sm:mb-8 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl">Restorani u blizini</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Koristite svoju trenutnu lokaciju da pronađete najbliže restorane u
          odabranom radijusu.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:mb-10 sm:flex-row sm:items-end sm:gap-4 sm:p-5">
        <div className="space-y-2 sm:flex-1">
          <Label htmlFor="radius" id="radius-label">
            Radijus pretrage
          </Label>
          <Select
            value={radius}
            onValueChange={(value) => {
              if (value != null) setRadius(String(value));
            }}
          >
            <SelectTrigger
              id="radius"
              aria-labelledby="radius-label"
              className="h-11 min-h-11 w-full sm:h-8 sm:min-h-8 sm:max-w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RADIUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={findNearbyRestaurants}
          disabled={isLoading}
          size="lg"
          className="h-12 min-h-12 w-full sm:h-9 sm:min-h-9 sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Tražim...
            </>
          ) : (
            <>
              <Navigation className="size-4" />
              Pronađi restorane u mojoj blizini
            </>
          )}
        </Button>
      </div>

      {coords ? (
        <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          Vaša lokacija: {coords.latitude.toFixed(5)},{" "}
          {coords.longitude.toFixed(5)} · radijus {radius} km
        </p>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Tražimo restorane u vašoj blizini...</p>
        </div>
      ) : null}

      {!isLoading && !error && hasSearched && restaurants.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
          Nema restorana u odabranom radijusu. Pokušajte sa većim radijusom.
        </div>
      ) : null}

      {!isLoading && restaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
