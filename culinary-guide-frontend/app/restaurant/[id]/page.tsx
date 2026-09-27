import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";

import { FavoriteButton } from "@/components/FavoriteButton";
import { RestaurantImage } from "@/components/RestaurantImage";
import { RestaurantMap } from "@/components/RestaurantMap";
import { ReviewForm } from "@/components/ReviewForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRestaurantById, getReviews } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

export const dynamic = "force-dynamic";

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("sr-Latn-BA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function ReviewItem({ review }: { review: Review }) {
  const author = review.userName?.trim() || "Anonimni korisnik";

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-sm font-medium">{author}</CardTitle>
            <div className="mt-1 flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-3.5",
                    index < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <CardDescription className="shrink-0 text-[11px] sm:text-sm">
            {formatDate(review.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90">
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  let restaurant;
  let reviews: Review[] = [];

  try {
    const [restaurantData, reviewsData] = await Promise.all([
      getRestaurantById(id),
      getReviews(id),
    ]);
    restaurant = restaurantData;
    reviews = reviewsData;
  } catch {
    notFound();
  }

  const rating =
    restaurant.averageRating != null
      ? Number(restaurant.averageRating).toFixed(1)
      : "—";

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-10">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-4 -ml-2 h-10 min-h-10 sm:mb-6 sm:h-7 sm:min-h-7"
        )}
      >
        <ArrowLeft className="size-3.5" />
        Nazad
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <RestaurantImage
            src={restaurant.imageUrl}
            alt={restaurant.name}
            variant="hero"
            priority
            className="-mx-4 aspect-[16/10] rounded-none sm:mx-0 sm:aspect-[2/1] sm:rounded-lg"
            iconClassName="size-14"
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary">
                  {restaurant.cuisineType}
                </p>
                <h1 className="mt-1 text-2xl sm:text-4xl">
                  {restaurant.name}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
                <Star
                  className="size-4 fill-amber-600 text-amber-600"
                  aria-hidden
                />
                <span className="text-sm font-semibold">{rating}</span>
                <span className="text-xs text-amber-900/80">prosek</span>
              </div>
            </div>

            <FavoriteButton
              restaurantId={restaurant.id}
              variant="button"
              className="w-full sm:w-auto"
            />

            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {restaurant.address}
            </p>

            <p className="max-w-3xl text-base leading-relaxed text-foreground/85">
              {restaurant.description}
            </p>
          </div>

          <section className="space-y-3 border-t pt-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Lokacija</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pogledajte restoran na mapi ili pokrenite navigaciju
              </p>
            </div>
            <RestaurantMap
              name={restaurant.name}
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
            />
          </section>

          <section className="space-y-4 border-t pt-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Recenzije</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {reviews.length === 0
                  ? "Još nema recenzija za ovaj restoran."
                  : `${reviews.length} ${reviews.length === 1 ? "recenzija" : "recenzija"}`}
              </p>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Ostavi recenziju</CardTitle>
              <CardDescription>
                Podijelite svoje iskustvo sa drugim posjetiocima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewForm restaurantId={restaurant.id} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
