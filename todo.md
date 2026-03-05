# Next Chapter Travel — Jessica Seiders | Project TODO

## Database & Backend
- [x] Extended schema: trips, itinerary_items, documents, messages, packing_items, bookings, destination_guides, travel_alerts
- [x] tRPC routers for all features (trips, itinerary, documents, messages, packing, bookings, guides, alerts, admin)
- [x] Admin-only procedures with role guard
- [x] Vitest unit tests (16 tests passing)
- [x] Notifications table + push_subscriptions table in DB
- [x] tRPC procedures: createNotification, listNotifications, markRead, markAllRead, broadcast, send
- [x] Push subscription tRPC endpoints (subscribe/unsubscribe)

## Landing Page
- [x] Video hero with editorial overlay (Next Chapter Travel style)
- [x] Navigation with Login/Sign Up
- [x] About Jessica section with real bio (Owner/CEO Next Chapter Travel LLC)
- [x] Interactive animated globe visual for About section
- [x] Facebook social link in nav, About section, and footer
- [x] Features overview grid (6 features)
- [x] Partner badge (Next Chapter Travel)
- [x] Testimonials section
- [x] How It Works section
- [x] CTA section
- [x] Footer

## Client Portal (authenticated)
- [x] Dashboard / Trip Overview page
- [x] Push notification opt-in widget in portal dashboard
- [x] In-app notification bell with unread badge in portal header
- [x] Notification dropdown drawer with mark-read/mark-all-read
- [x] Itinerary page (day-by-day timeline with categories)
- [x] Document Vault (upload/view passports, confirmations, boarding passes)
- [x] Destination Guides (real-time local tips per destination)
- [x] In-App Messaging with Jessica
- [x] Packing List / Checklist (with category grouping and progress bar)
- [x] Booking Status Tracker (flights, hotels, tours, transfers)
- [x] Emergency Contacts & Alerts page

## Admin Dashboard (Jessica)
- [x] Admin dashboard overview with stats (clients, trips, messages)
- [x] Client management (list, view, detail with trip history)
- [x] Itinerary builder (create/edit trips per client)
- [x] Messaging center (all client threads)
- [x] Destination guide editor (create guides with tips, emergency numbers)
- [x] Alert sender (send info/warning/urgent alerts to clients)
- [x] Notification composer (targeted + broadcast with quick templates)
- [x] Notifications link in admin sidebar nav

## Polish & UX
- [x] Global CSS theme (navy/gold/cream palette with OKLCH)
- [x] Playfair Display serif + Inter sans-serif typography
- [x] Mobile responsive design with hamburger sidebar
- [x] Loading states and empty states on all pages
- [x] Toast notifications throughout
- [x] Role-based navigation (client portal vs admin dashboard)
- [x] Sidebar navigation for both portal and admin
- [x] Full routing in App.tsx (17 routes)
- [x] Browser push service worker (sw.js)

## Pending
- [ ] Jessica's real headshot photo (skipped by user request — add when available)
