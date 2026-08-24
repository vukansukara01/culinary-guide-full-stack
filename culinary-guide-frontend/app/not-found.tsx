import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Stranica nije pronađena
      </h1>
      <p className="text-sm text-muted-foreground">
        Traženi restoran ili stranica ne postoji.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Nazad na početnu
      </Link>
    </div>
  );
}
