import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#065f46",
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
      className={`${plusJakarta.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <footer className="border-t px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Kulinarski vodič Banja Luka
            </footer>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
