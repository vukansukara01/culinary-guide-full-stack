"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/api";
import { cn } from "@/lib/utils";
import { reviewSchema, type ReviewFormValues } from "@/lib/validation";

interface ReviewFormProps {
  restaurantId: number;
}

export function ReviewForm({ restaurantId }: ReviewFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady, user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const rating = watch("rating");

  async function onSubmit(values: ReviewFormValues) {
    setServerError(null);
    setSuccess(false);

    if (!isAuthenticated) {
      setServerError("Morate biti prijavljeni da ostavite recenziju.");
      return;
    }

    try {
      await createReview(restaurantId, {
        rating: values.rating,
        comment: values.comment,
      });
      reset({ rating: 5, comment: "" });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri slanju recenzije. Pokušajte ponovo.";
      setServerError(message);
    }
  }

  if (isReady && !isAuthenticated) {
    const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Da biste ostavili recenziju, potrebno je da se prijavite.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link href={loginHref}>
            <Button>Prijavi se</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Registruj se</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {user?.name ? (
        <p className="text-sm text-muted-foreground">
          Pišete kao <span className="font-medium text-foreground">{user.name}</span>
        </p>
      ) : null}

      <div className="space-y-2">
        <Label id="review-rating-label">Ocena</Label>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-labelledby="review-rating-label"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("rating", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Ocena ${value}`}
            >
              <Star
                className={cn(
                  "size-7 transition-colors",
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40"
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} / 5
          </span>
        </div>
        {errors.rating ? (
          <p className="text-sm text-destructive">{errors.rating.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Komentar</Label>
        <Textarea
          id="comment"
          placeholder="Podijelite svoje iskustvo..."
          rows={4}
          aria-invalid={Boolean(errors.comment)}
          {...register("comment")}
        />
        {errors.comment ? (
          <p className="text-sm text-destructive">{errors.comment.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive">{serverError}</p>
      ) : null}
      {success ? (
        <p className="text-sm text-primary">
          Recenzija je uspješno poslana!
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !isReady}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Šaljem..." : "Pošalji recenziju"}
      </Button>
    </form>
  );
}
