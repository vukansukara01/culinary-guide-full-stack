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
      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Banja Luka
            </p>
            <h1 className="text-balance mt-3 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Gdje danas ručate?
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Pregledajte restorane grada, pročitajte iskrena mišljenja i
              pronađite mjesto u vašoj blizini.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/nearby"
              className={cn(buttonVariants({ size: "lg" }), "h-11 min-h-11")}
            >
              <MapPin className="size-4" />
              Restorani u blizini
            </Link>
            <p className="text-sm text-muted-foreground">
              {data && !error
                ? `${data.totalElements} mjesta u bazi`
                : "Pretraga po lokaciji i kuhinji"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl">Svi restorani</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sortirano po recenzijama · 20 po stranici
            </p>
          </div>
          {data && !error ? (
            <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {data.totalElements}{" "}
              {data.totalElements === 1 ? "restoran" : "restorana"}
            </p>
          ) : null}
        </div>

        <Suspense fallback={null}>
          <RestaurantFilters cuisines={cuisines} />
        </Suspense>

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
            {error}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-16 text-center text-sm text-muted-foreground">
            Nema restorana za odabrane filtere.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  priority={index < 3}
                />
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
