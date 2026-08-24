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

export async function registerUser(
  body: RegisterRequest
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
  body: { rating: number; comment: string },
  token: string
): Promise<Review> {
  const res = await fetch(
    `${API_BASE_URL}/api/restaurants/${restaurantId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getFavorites(token: string): Promise<Restaurant[]> {
  const res = await fetch(`${API_BASE_URL}/api/favorites`, {
    headers: authHeaders(token),
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

export async function getFavoriteIds(token: string): Promise<number[]> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/ids`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Neuspješno učitavanje favorita");
  }

  return res.json();
}

export async function addFavorite(
  restaurantId: string | number,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/${restaurantId}`, {
    method: "POST",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Morate biti prijavljeni da sačuvate restoran.");
    }
    throw new Error("Neuspješno dodavanje u favorite");
  }
}

export async function removeFavorite(
  restaurantId: string | number,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/favorites/${restaurantId}`, {
    method: "DELETE",
    headers: authHeaders(token),
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
    method: "POST",
  });

  if (!res.ok) {
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
