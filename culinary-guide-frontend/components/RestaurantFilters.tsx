"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RestaurantFiltersProps {
  cuisines: string[];
}

export function RestaurantFilters({ cuisines }: RestaurantFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sort = searchParams.get("sort") ?? "reviews";
  const cuisine = searchParams.get("cuisine") ?? "";
  const minRating = searchParams.get("minRating") ?? "";
  const q = searchParams.get("q") ?? "";

  const hasActiveFilters =
    Boolean(cuisine) || Boolean(minRating) || Boolean(q) || sort !== "reviews";
  const [open, setOpen] = useState(hasActiveFilters);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    for (const [key, value] of Object.entries(updates)) {
      if (value == null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/?${query}` : "/");
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push("/");
    });
  }

  const filterGrid = (
    <>
      <div className="space-y-2">
        <Label htmlFor="filter-sort" id="filter-sort-label">
          Sortiranje
        </Label>
        <Select
          value={sort}
          onValueChange={(value) => {
            if (value != null) updateParams({ sort: String(value) });
          }}
        >
          <SelectTrigger
            id="filter-sort"
            aria-labelledby="filter-sort-label"
            className="h-11 min-h-11 w-full sm:h-8 sm:min-h-8"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reviews">Najviše recenzija</SelectItem>
            <SelectItem value="rating">Najbolja ocjena</SelectItem>
            <SelectItem value="name">Naziv A–Ž</SelectItem>
            <SelectItem value="name_desc">Naziv Ž–A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-cuisine" id="filter-cuisine-label">
          Kuhinja
        </Label>
        <Select
          value={cuisine || "all"}
          onValueChange={(value) => {
            if (value != null) updateParams({ cuisine: String(value) });
          }}
        >
          <SelectTrigger
            id="filter-cuisine"
            aria-labelledby="filter-cuisine-label"
            className="h-11 min-h-11 w-full sm:h-8 sm:min-h-8"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sve kuhinje</SelectItem>
            {cuisines.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-rating" id="filter-rating-label">
          Minimalna ocjena
        </Label>
        <div className="flex gap-2">
          <Select
            value={minRating || "all"}
            onValueChange={(value) => {
              if (value != null) updateParams({ minRating: String(value) });
            }}
          >
            <SelectTrigger
              id="filter-rating"
              aria-labelledby="filter-rating-label"
              className="h-11 min-h-11 w-full sm:h-8 sm:min-h-8"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve ocjene</SelectItem>
              <SelectItem value="4.5">4.5+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="h-11 min-h-11 sm:h-8 sm:min-h-8"
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`mb-6 space-y-3 rounded-lg border bg-card p-3 shadow-sm sm:mb-8 sm:p-4 ${
        isPending ? "opacity-70" : ""
      }`}
    >
      <div className="space-y-2">
        <Label htmlFor="q">Pretraga</Label>
        <Input
          id="q"
          defaultValue={q}
          placeholder="Naziv restorana..."
          className="h-11 min-h-11 sm:h-8 sm:min-h-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({ q: (e.target as HTMLInputElement).value.trim() });
            }
          }}
          onBlur={(e) => updateParams({ q: e.target.value.trim() })}
        />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <Button
          type="button"
          variant="outline"
          className="h-11 min-h-11 flex-1"
          onClick={() => setOpen((value) => !value)}
        >
          <SlidersHorizontal className="size-4" />
          Filteri i sortiranje
          {hasActiveFilters ? (
            <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              aktivno
            </span>
          ) : null}
        </Button>
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            className="h-11 min-h-11 px-3"
            onClick={clearFilters}
            aria-label="Poništi filtere"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${open ? "" : "hidden"} lg:grid`}>
        {filterGrid}
      </div>
    </div>
  );
}
