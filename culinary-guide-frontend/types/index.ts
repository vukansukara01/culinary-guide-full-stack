export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  cuisineType: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  averageRating: number;
  reviewCount?: number | null;
  googlePlaceId?: string | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: number | null;
  userName?: string | null;
}

export interface GeoSearchRequest {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  name: string;
  email: string;
}

export interface PlacesImportResult {
  fetched: number;
  created: number;
  updated: number;
  reviewsImported: number;
  message: string;
}

export interface RestaurantPageResponse {
  content: Restaurant[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

