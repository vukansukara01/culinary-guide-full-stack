# Kulinarski vodič — Banja Luka

Full-stack platforma za pretragu i recenziju ugostiteljskih objekata.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Spring Boot, Spring Security (JWT), Spring Data JPA
- **Infra:** MySQL + Redis (Docker Compose), Redis GEO za prostornu pretragu

## Pokretanje

### Backend

```bash
cd culinary-guide-backend
cp .env.example .env         # upiši JWT_SECRET (obavezno), GOOGLE_PLACES_API_KEY, ADMIN_EMAILS
set -a; source .env; set +a  # konfiguracija se čita isključivo iz environment varijabli
# MySQL (3307) i Redis (6379) se podižu preko compose.yaml
./mvnw spring-boot:run
```

API: `http://localhost:9090`

Produkcija (HTTPS): `JWT_COOKIE_SECURE=true` i `CORS_ALLOWED_ORIGINS=https://tvoj-domen`.

### Frontend

```bash
cd culinary-guide-frontend
cp .env.example .env.local   # po potrebi
npm install
npm run dev
```

App: `http://localhost:3000`

## Repo

- `culinary-guide-backend/` — Spring Boot
- `culinary-guide-frontend/` — Next.js
