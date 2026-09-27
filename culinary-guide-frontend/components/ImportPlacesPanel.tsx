"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { importPlacesFromGoogle } from "@/lib/api";
import type { PlacesImportResult } from "@/types";

export function ImportPlacesPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlacesImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await importPlacesFromGoogle();
      setResult(data);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri uvozu podataka."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            Uvoz restorana (Google Places)
          </CardTitle>
          <CardDescription>
            Povlači restorane iz Banja Luke (samo tip &quot;restaurant&quot;).
            Uvoz treba samo jednom ili kad želiš osvježiti podatke — ostaju u
            MySQL bazi. Slike se serviraju direktno sa Google Places Photo API-ja.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uvozim... (može potrajati)
              </>
            ) : (
              <>
                <Download className="size-4" />
                Uvezi restorane iz Banja Luke
              </>
            )}
          </Button>

          {error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {result ? (
            <div className="space-y-2 rounded-lg border bg-muted/40 px-3 py-3 text-sm">
              <p className="font-medium text-primary">{result.message}</p>
              <ul className="list-inside list-disc text-muted-foreground">
                <li>Pronađeno: {result.fetched}</li>
                <li>Novih: {result.created}</li>
                <li>Ažuriranih: {result.updated}</li>
                <li>Recenzija: {result.reviewsImported}</li>
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
