import Link from "next/link";
import { Suspense } from "react";
import { MapPin } from "lucide-react";

import { Pagination } from "@/components/Pagination";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantFilters } from "@/components/RestaurantFilters";
import { buttonVariants } from "@/components/ui/button";
import { getCuisineTypes, getRestaurants } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { RestaurantPageResponse } from "@/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    cuisine?: string;
    minRating?: string;
    q?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const pageFromUrl = Number.parseInt(params.page ?? "1", 10);
  const pageOneBased =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const pageZeroBased = pageOneBased - 1;

  const sort = params.sort || "reviews";
  const cuisine = params.cuisine || undefined;
  const minRating = params.minRating || undefined;
  const q = params.q || undefined;

  let data: RestaurantPageResponse | null = null;
  let cuisines: string[] = [];
  let error: string | null = null;

  try {
    const [pageData, cuisineData] = await Promise.all([
      getRestaurants(pageZeroBased, PAGE_SIZE, {
        sort,
        cuisine,
        minRating,
        q,
      }),
      getCuisineTypes(),
    ]);
    data = pageData;
    cuisines = cuisineData;
  } catch {
    error =
      "Nije moguće učitati restorane. Provjerite da li je backend pokrenut na localhost:9090.";
  }

  const restaurants = data?.content ?? [];
  const queryForPagination = {
    sort: sort !== "reviews" ? sort : undefined,
    cuisine,
    minRating,
    q,
  };

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.35), transparent 45%), radial-gradient(circle at 80% 60%, rgba(251, 191, 36, 0.2), transparent 40%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:gap-6 sm:px-6 sm:py-24">
          <p className="text-xs font-medium tracking-wide text-emerald-200/90 uppercase sm:text-sm">
            Putnički i kulinarski vodič
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Otkrijte najbolje ukuse Banja Luke
          </h1>
          <p className="max-w-xl text-sm text-white/75 sm:text-lg">
            Istražite restorane, pročitajte recenzije i pronađite savršeno mjesto
            za jelo u vašoj blizini.
          </p>
          <div>
            <Link
              href="/nearby"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 min-h-12 bg-white text-emerald-950 hover:bg-emerald-50 sm:h-9 sm:min-h-9"
              )}
            >
              <MapPin className="size-4" />
              Pronađi u blizini
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-14">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Svi restorani
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sortirano po recenzijama · 20 po stranici
            </p>
          </div>
          {data && !error ? (
            <p className="shrink-0 text-sm text-muted-foreground">
              {data.totalElements}{" "}
              {data.totalElements === 1 ? "restoran" : "restorana"}
            </p>
          ) : null}
        </div>

        <Suspense fallback={null}>
          <RestaurantFilters cuisines={cuisines} />
        </Suspense>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-xl border bg-muted/40 px-4 py-12 text-center text-sm text-muted-foreground">
            Nema restorana za odabrane filtere.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            {data ? (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                size={data.size}
                query={queryForPagination}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
