import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Link from "next/link";

import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8B4A32",
};

export const metadata: Metadata = {
  title: "Kulinarski vodič | Banja Luka",
  description:
    "Otkrijte najbolje restorane Banja Luke, čitajte recenzije i pronađite mjesta u svojoj blizini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <footer className="mt-auto border-t bg-card/60">
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <p className="font-heading text-sm font-medium text-foreground">
                    Kulinarski vodič Banja Luka
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lokalni restorani, recenzije i pretraga u blizini
                  </p>
                </div>
                <nav
                  aria-label="Linkovi u podnožju"
                  className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
                >
                  <Link href="/" className="hover:text-foreground">
                    Restorani
                  </Link>
                  <Link href="/nearby" className="hover:text-foreground">
                    U blizini
                  </Link>
                  <Link href="/favorites" className="hover:text-foreground">
                    Favoriti
                  </Link>
                </nav>
              </div>
              <div className="border-t px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Kulinarski vodič Banja Luka
              </div>
            </footer>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
