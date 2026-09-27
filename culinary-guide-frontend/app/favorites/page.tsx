"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/components/FavoritesProvider";
import { getFavorites } from "@/lib/api";
import type { Restaurant } from "@/types";

export default function FavoritesPage() {
  const { token, isAuthenticated, isReady } = useAuth();
  const { favoriteIds } = useFavorites();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated || !token) {
      setRestaurants([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getFavorites(token)
      .then((data) => {
        if (!cancelled) setRestaurants(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Nije moguće učitati favorite."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, isAuthenticated, token]);

  const visible = restaurants.filter((restaurant) =>
    favoriteIds.has(restaurant.id)
  );

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 space-y-2 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl">Favoriti</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Restorani koje ste sačuvali za kasnije.
        </p>
      </div>

      {!isReady || isLoading ? (
        <div className="rounded-xl border bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
          Učitavanje favorita...
        </div>
      ) : !isAuthenticated ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-10 text-center">
          <Heart className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Prijavite se da sačuvate restorane i vidite favorite.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link href="/login?redirect=/favorites">
              <Button className="h-11 min-h-11">
                Prijavi se
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="h-11 min-h-11">
                Registruj se
              </Button>
            </Link>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
          Još nemate sačuvanih restorana. Na kartici restorana pritisnite srce da
          ga dodate ovdje.
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" className="h-11 min-h-11">
                Pregledaj restorane
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visible.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
