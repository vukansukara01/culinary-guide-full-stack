"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Download,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  UserPlus,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-heading text-base font-semibold tracking-tight"
          onClick={closeMenu}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
            <UtensilsCrossed className="size-4" />
          </span>
          <span className="truncate">Kulinarski vodič</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Restorani
          </Link>
          <Link
            href="/nearby"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <MapPin className="size-3.5" />
            U blizini
          </Link>
          {isAuthenticated ? (
            <Link
              href="/favorites"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <Heart className="size-3.5" />
              Favoriti
            </Link>
          ) : null}
          <Link
            href="/import"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Download className="size-3.5" />
            Uvoz
          </Link>

          {isReady ? (
            isAuthenticated ? (
              <>
                {user?.name ? (
                  <span className="max-w-[10rem] truncate px-2 text-sm text-muted-foreground">
                    {user.name}
                  </span>
                ) : null}
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="size-3.5" />
                  Odjavi se
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <LogIn className="size-3.5" />
                  Prijava
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-emerald-800 text-white hover:bg-emerald-800/90"
                  )}
                >
                  <UserPlus className="size-3.5" />
                  Registracija
                </Link>
              </>
            )
          ) : null}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/nearby"
            aria-label="Restorani u blizini"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))}
          >
            <MapPin className="size-5" />
          </Link>
          {isAuthenticated ? (
            <Link
              href="/favorites"
              aria-label="Favoriti"
              className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))}
            >
              <Heart className="size-5" />
            </Link>
          ) : null}
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-11 min-h-11 justify-start"
              )}
            >
              Restorani
            </Link>
            <Link
              href="/nearby"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-11 min-h-11 justify-start"
              )}
            >
              <MapPin className="size-4" />
              U blizini
            </Link>
            {isAuthenticated ? (
              <Link
                href="/favorites"
                onClick={closeMenu}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-11 min-h-11 justify-start"
                )}
              >
                <Heart className="size-4" />
                Favoriti
              </Link>
            ) : null}
            <Link
              href="/import"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-11 min-h-11 justify-start"
              )}
            >
              <Download className="size-4" />
              Uvoz
            </Link>

            <div className="my-1 border-t" />

            {isReady ? (
              isAuthenticated ? (
                <>
                  {user?.name ? (
                    <p className="px-2 py-2 text-sm text-muted-foreground">
                      {user.name}
                    </p>
                  ) : null}
                  <Button
                    variant="ghost"
                    className="h-11 min-h-11 justify-start"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <LogOut className="size-4" />
                    Odjavi se
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-11 min-h-11 justify-start"
                    )}
                  >
                    <LogIn className="size-4" />
                    Prijava
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className={cn(
                      buttonVariants(),
                      "h-11 min-h-11 justify-start bg-emerald-800 text-white hover:bg-emerald-800/90"
                    )}
                  >
                    <UserPlus className="size-4" />
                    Registracija
                  </Link>
                </>
              )
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
