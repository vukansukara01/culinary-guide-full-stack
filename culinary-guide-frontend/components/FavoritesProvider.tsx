"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/AuthProvider";
import { addFavorite, getFavoriteIds, removeFavorite } from "@/lib/api";

interface FavoritesContextValue {
  favoriteIds: Set<number>;
  isFavorite: (restaurantId: number) => boolean;
  toggleFavorite: (restaurantId: number) => Promise<void>;
  isReady: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isReady: authReady } = useAuth();
  const userEmail = user?.email;
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!userEmail) {
      setFavoriteIds(new Set());
      setIsReady(true);
      return;
    }

    let cancelled = false;
    setIsReady(false);

    getFavoriteIds()
      .then((ids) => {
        if (!cancelled) setFavoriteIds(new Set(ids));
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds(new Set());
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, userEmail]);

  const isFavorite = useCallback(
    (restaurantId: number) => favoriteIds.has(restaurantId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (restaurantId: number) => {
      if (!isAuthenticated) {
        throw new Error("Morate biti prijavljeni da sačuvate restoran.");
      }

      const currentlyFavorite = favoriteIds.has(restaurantId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (currentlyFavorite) {
          next.delete(restaurantId);
        } else {
          next.add(restaurantId);
        }
        return next;
      });

      try {
        if (currentlyFavorite) {
          await removeFavorite(restaurantId);
        } else {
          await addFavorite(restaurantId);
        }
      } catch (error) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (currentlyFavorite) {
            next.add(restaurantId);
          } else {
            next.delete(restaurantId);
          }
          return next;
        });
        throw error;
      }
    },
    [favoriteIds, isAuthenticated]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      isReady,
    }),
    [favoriteIds, isFavorite, toggleFavorite, isReady]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites mora biti korišten unutar FavoritesProvider-a");
  }
  return context;
}
