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

## Mobile Optimization (Deep Pass)
- [x] PWA manifest.json with icons, theme color, display: standalone
- [x] Viewport meta tag audit (index.html)
- [x] Mobile bottom navigation bar for client portal (replaces sidebar on mobile)
- [x] Safe area insets for notched phones (env(safe-area-inset-*))
- [x] Touch target minimum 44px on all interactive elements
- [x] Landing page hero: full-screen mobile, readable font sizes
- [x] Landing page features grid: 1-col on mobile
- [x] Landing page About section: stacked layout on mobile
- [x] Portal Dashboard: card layout optimized for thumb reach
- [x] Portal Itinerary: timeline optimized for mobile scroll
- [x] Portal Documents: upload button prominent on mobile
- [x] Portal Messages: chat bubble layout, keyboard-aware input
- [x] Portal Packing List: large checkboxes, easy tap targets
- [x] Portal Bookings: horizontal scroll cards on mobile
- [x] Notification bell: full-width drawer on mobile
- [x] Admin mobile: collapsible sidebar → bottom sheet
- [x] Smooth page transitions (CSS animations + stagger)
- [x] Mobile typography scale (fluid type)
- [x] Sticky CTAs on mobile landing page
- [x] Add to Home Screen prompt (beforeinstallprompt via manifest)

## Real-Time Messaging (SSE Upgrade)
- [x] SSE endpoint: GET /api/messages/stream (per-user channel)
- [x] In-memory message broker (Map of SSE clients by userId)
- [x] Broadcast helper: push new messages to all connected clients
- [x] Typing indicator SSE events (start/stop typing)
- [x] Read receipt SSE events (mark delivered on open)
- [x] Client portal Messages: SSE hook, live message append, typing bubble
- [x] Admin Messages: SSE hook, per-client thread list, live unread badges
- [x] Message status badges (sent / delivered / read)
- [x] Unread count badge synced via SSE on bottom nav
- [x] Mobile polish: smooth message entrance animation
- [x] Vitest tests for real-time messaging procedures (covered by travel.test.ts)

## Chat File Attachments
- [x] messages table: add attachmentUrl, attachmentName, attachmentType, attachmentSize columns
- [x] tRPC: messages.uploadAttachment procedure (base64 → S3, 16MB limit, type allowlist)
- [x] tRPC: messages.send updated to accept attachment metadata
- [x] Shared ChatAttachment component (image lightbox + PDF/doc icon)
- [x] AttachmentPicker + AttachmentPreview + AttachmentBubble components
- [x] Client portal Messages: attachment picker + display in bubbles
- [x] Admin Messages: attachment picker + display in bubbles
- [x] SSE broadcast includes attachment fields
- [x] Mobile: camera capture button (capture=environment)
- [x] File size validation (16MB max) and type whitelist

## Dynamic Context-Aware Video Hero
- [x] Curate free CDN video URLs for each context (landing, itinerary, documents, messages, packing, bookings, guides, alerts, dashboard)
- [x] VideoHeroContext provider + useVideoHero hook
- [x] GlobalVideoBackground component with smooth crossfade transitions
- [x] Landing page: cinematic travel montage loop
- [x] Portal Dashboard: calm destination overview video
- [x] Itinerary page: adventure/journey video
- [x] Document Vault: airport/travel prep video
- [x] Messages: cozy travel cafe / connection video
- [x] Packing List: suitcase/packing video
- [x] Bookings: flight/hotel video
- [x] Destination Guides: destination-specific video (changes per guide)
- [x] Alerts: dramatic sky/weather video
- [x] Video preloading + fallback static image (preloadVideo on nav hover)
- [x] Reduced-motion media query support (instant swap fallback)

## Bug Fixes (Mobile Rendering)
- [ ] Nav bar: fix gold/cream background showing instead of transparent over video
- [ ] Hero section: fix height so it fills full screen on mobile
- [ ] About section: fix overlap/bleed into hero area
- [ ] iOS Safari: fix video fallback — dark background instead of gold/cream
- [ ] GlobalVideoBackground: ensure dark fallback color (#0a1628 navy) not cream

## Video Playback Fix (iOS Safari)
- [ ] Download travel videos locally and upload to project CDN
- [ ] Replace Pexels cross-origin URLs with CDN-hosted URLs
- [ ] Fix nav bar gold background showing instead of transparent
- [ ] Fix About section solid background blocking video
