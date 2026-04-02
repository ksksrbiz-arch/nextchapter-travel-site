# Next Chapter Travel — Client Portal & Admin

Modern travel concierge experience for Jessica Seiders, including a client portal, admin dashboard, and supporting Express + tRPC API. Built with Vite + React on the frontend and a TypeScript Node server that serves both the API and static assets.

## Features
- Client portal with itinerary, packing list, insurance tracker, loyalty tracker, and document tools
- Admin dashboard with trip builder wizard, client management, and messaging
- tRPC API with SSE-based real-time updates
- Theming, responsive layout, and role-based navigation

## Tech Stack
- React 19, Vite, Tailwind
- Express + tRPC
- Drizzle ORM (MySQL-compatible)
- Vitest, ESLint, TypeScript

## Getting Started
1. Install dependencies (pnpm recommended):
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` and fill in required values:
   - `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`
   - OAuth/Forge integration: `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`
   - Optional: `RESEND_API_KEY`, `METRICS_TOKEN`, `OWNER_OPEN_ID`
3. Run the app in development (Express API + Vite dev server):
   ```bash
   pnpm dev
   ```
   The server chooses an available port starting at 3000 and proxies Vite during development.

## Scripts
- `pnpm dev` — start API with Vite dev middleware
- `pnpm build` — build client assets and bundle server to `dist/`
- `pnpm start` — run production build from `dist/`
- `pnpm test` — run Vitest suite
- `pnpm lint` — lint TypeScript/React files
- `pnpm check` — TypeScript type check

## Deployment & Docs
- Deployment targets: Netlify (static) + Render (API). See `DEPLOYMENT.md` and `PHASE_3_DEPLOYMENT.md`.
- Roadmap and feature breakdowns: `IMPLEMENTATION_ROADMAP.md`, `PORTAL_IMPROVEMENTS.md`, and `todo.md`.

## Project Structure
- `client/` — React application (Vite root)
- `server/` — Express + tRPC API and backend utilities
- `shared/` — shared types and utilities between client and server
- `drizzle/` — database migrations and schema

