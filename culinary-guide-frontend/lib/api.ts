import type {
  AuthResponse,
  GeoSearchRequest,
  LoginRequest,
  PlacesImportResult,
  RegisterRequest,
  Restaurant,
  RestaurantPageResponse,
  Review,
} from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090";

/**
 * Apsolutni URL za sliku.
 * Za Google Places Photo smanjuje maxwidth (Lighthouse: Improve image delivery).
 */
export function resolveImageUrl(
  url?: string | null,
  options?: { maxWidth?: number }
): string | null {
  if (!url) return null;

  // Placeholder demo URL-ovi — ne učitavaj (404 u konzoli / Lighthouse)
  if (url.includes("example.com")) {
    return null;
  }

  let resolved: string;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    resolved = url;
  } else {
    const path = url.startsWith("/") ? url : `/${url}`;
    resolved = `${API_BASE_URL}${path}`;
  }

  const maxWidth = options?.maxWidth;
  if (
    maxWidth &&
    resolved.includes("maps.googleapis.com/maps/api/place/photo")
  ) {
    try {
      const parsed = new URL(resolved);
      parsed.searchParams.set("maxwidth", String(maxWidth));
      return parsed.toString();
    } catch {
      return resolved;
    }
  }

  return resolved;
}

// JWT živi u httpOnly kolačiću koji postavlja backend — JS ga ne može pročitati,
// pa svaki autentifikovani zahtjev mora slati kolačiće (credentials: "include").
const withCredentials: RequestInit = { credentials: "include" };

export async function registerUser(
  body: RegisterRequest
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    ...withCredentials,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Neuspješna registracija";
    try {
      const data = await res.json();
      if (typeof data?.message === "string" && data.message) {
        message = data.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function loginUser(body: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    ...withCredentials,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Neuspješna prijava";
    try {
      const data = await res.json();
      if (typeof data?.message === "string" && data.message) {
        message = data.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

/** Vraća prijavljenog korisnika na osnovu kolačića, ili null (backend vraća 204). */
export async function getCurrentUser(): Promise<AuthResponse | null> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    ...withCredentials,
    cache: "no-store",
  });

  if (res.status === 204 || !res.ok) {
    return null;
  }

  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    ...withCredentials,
    method: "POST",
  });
}

export async function getRestaurants(
  page = 0,
  size = 20,
  options: {
    sort?: string;
    cuisine?: string;
    minRating?: string;
    q?: string;
  } = {}
): Promise<RestaurantPageResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", options.sort || "reviews");
  if (options.cuisine) params.set("cuisine", options.cuisine);
  if (options.minRating) params.set("minRating", options.minRating);
  if (options.q) params.set("q", options.q);

  const res = await fetch(`${API_BASE_URL}/api/restaurants?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Neuspješno učitavanje restorana");
  }

  return res.json();
}

export async function getCuisineTypes(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/restaurants/cuisines`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function getRestaurantById(id: string | number): Promise<Restaurant> {
  const res = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Restoran nije pronađen");
  }

  return res.json();
}

export async function getReviews(restaurantId: string | number): Promise<Review[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/restaurants/${restaurantId}/reviews`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Neuspješno učitavanje recenzija");
  }

  return res.json();
}

export async function createReview(
  restaurantId: string | number,
  body: { rating: number; comment: string }
): Promise<Review> {
  const res = await fetch(
    `${API_BASE_URL}/api/restaurants/${restaurantId}/reviews`,
    {
      ...withCredentials,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Morate biti prijavljeni da ostavite recenziju.");
    }
    throw new Error("Neuspješno slanje recenzije");
  }

  return res.json();
}

export async function getNearbyRestaurants(
  body: GeoSearchRequest
): Promise<Restaurant[]> {
  const res = await fetch(`${API_BASE_URL}/api/restaurants/nearby`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Neuspješna pretraga restorana u blizini");
  }

  return res.json();
}

export async function getFavorites(): Promise<Restaurant[]> {
  const res = await fetch(`${API_BASE_URL}/api/favorites`, {
    ...withCredentials,
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Morate biti prijavljeni da vidite favorite.");
    }
    throw new Error("Neuspješno učitavanje favorita");
  }

  return res.json();
}

export async function getFavoriteIds(): Promise<number[]> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/ids`, {
    ...withCredentials,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Neuspješno učitavanje favorita");
  }

  return res.json();
}

export async function addFavorite(restaurantId: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/${restaurantId}`, {
    ...withCredentials,
    method: "POST",
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Morate biti prijavljeni da sačuvate restoran.");
    }
    throw new Error("Neuspješno dodavanje u favorite");
  }
}

export async function removeFavorite(restaurantId: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/${restaurantId}`, {
    ...withCredentials,
    method: "DELETE",
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Morate biti prijavljeni da uklonite favorit.");
    }
    throw new Error("Neuspješno uklanjanje favorita");
  }
}

export async function importPlacesFromGoogle(): Promise<PlacesImportResult> {
  const res = await fetch(`${API_BASE_URL}/api/admin/import/places`, {
    ...withCredentials,
    method: "POST",
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Samo administrator može pokrenuti uvoz restorana.");
    }
    let message = "Neuspješan uvoz restorana iz Google Places";
    try {
      const data = await res.json();
      if (typeof data?.message === "string" && data.message) {
        message = data.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}
