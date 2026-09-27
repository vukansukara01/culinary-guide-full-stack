import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number; // 0-based
  totalPages: number;
  totalElements: number;
  size: number;
  query?: Record<string, string | undefined>;
}

function buildHref(
  pageOneBased: number,
  query?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  if (pageOneBased > 1) {
    params.set("page", String(pageOneBased));
  }
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

/** Builds page numbers with ellipsis, e.g. 1 … 4 5 6 … 12 */
function getPageItems(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) {
    items.push("…");
  }

  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  if (end < totalPages - 1) {
    items.push("…");
  }

  items.push(totalPages);
  return items;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  query,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const current = page + 1;
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);
  const pageItems = getPageItems(current, totalPages);

  const prevHref = page <= 0 ? null : buildHref(page, query);
  const nextHref =
    page >= totalPages - 1 ? null : buildHref(page + 2, query);

  return (
    <div className="relative mt-10 flex flex-col items-center gap-3 sm:block sm:min-h-9">
      <nav
        aria-label="Paginacija"
        className="flex flex-wrap items-center justify-center gap-1 sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2"
      >
        {prevHref ? (
          <Link
            href={prevHref}
            aria-label="Prethodna stranica"
            className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "size-10 sm:size-7")}
          >
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span
            aria-disabled
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "pointer-events-none size-10 opacity-40 sm:size-7"
            )}
          >
            <ChevronLeft className="size-4" />
          </span>
        )}

        {pageItems.map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(item, query)}
              aria-label={`Stranica ${item}`}
              aria-current={item === current ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: item === current ? "default" : "outline",
                  size: "icon-sm",
                }),
                "size-10 sm:size-7",
                item === current && "pointer-events-none"
              )}
            >
              {item}
            </Link>
          )
        )}

        {nextHref ? (
          <Link
            href={nextHref}
            aria-label="Sljedeća stranica"
            className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "size-10 sm:size-7")}
          >
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span
            aria-disabled
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "pointer-events-none size-10 opacity-40 sm:size-7"
            )}
          >
            <ChevronRight className="size-4" />
          </span>
        )}
      </nav>

      <p className="text-sm text-muted-foreground sm:absolute sm:top-1/2 sm:right-0 sm:-translate-y-1/2">
        Prikazano {from}–{to} od {totalElements}
      </p>
    </div>
  );
}
