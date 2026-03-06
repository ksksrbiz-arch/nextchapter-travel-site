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
- [x] Nav bar: fix gold/cream background showing instead of transparent over video
- [ ] Hero section: fix height so it fills full screen on mobile
- [ ] About section: fix overlap/bleed into hero area
- [x] iOS Safari: fix video fallback — dark background instead of gold/cream
- [x] GlobalVideoBackground: ensure dark fallback color (#0a1628 navy) not cream

## Video Playback Fix (iOS Safari)
- [x] Download travel videos locally and upload to project CDN
- [x] Replace Pexels cross-origin URLs with CDN-hosted URLs
- [x] Fix nav bar gold background showing instead of transparent (bg-transparent)
- [x] Fix About section solid background blocking video

## Session 3 — Video Fix, Demo Data & Invite Flow
- [x] Fix video background display: changed bg-background to bg-transparent in Home.tsx
- [x] Fix TypeScript error: add currentKey to VideoHeroContextValue type
- [x] Seed demo data: Sarah Mitchell (Disney World trip) + Linda Johnson (NCL Cruise)
- [x] Seed Disney World itinerary: 4 days, 16 items (flights, resort, Magic Kingdom, EPCOT, Hollywood Studios)
- [x] Seed bookings: flights, hotel, park tickets, Magical Express
- [x] Seed packing list: 16 items across 5 categories
- [x] Seed messages: 3 conversation messages between Jessica and Sarah
- [x] Seed Walt Disney World destination guide with tips and emergency numbers
- [x] Seed travel alert for Lightning Lane booking window
- [x] Add invite_tokens table to schema + migration applied
- [x] Add createInviteToken, getInviteToken, markInviteTokenUsed, getInviteTokensCreatedBy helpers to db.ts
- [x] Add invites router (create, list, validate, accept) to routers.ts
- [x] Create JoinPage (/join?token=...) with invite validation UI
- [x] Add /join route to App.tsx
- [x] Add "Send Portal Invite" button + dialog to AdminClients page
- [x] 21 vitest tests passing (5 new invite tests)

## Session 4 — Real Travel Videos & Dynamic Switching
- [x] Source real travel videos from Mixkit (free, commercial use): landing (aerial coast), dashboard (beach waves), itinerary (mountain highway), documents (airport departure), messages (Venice canal), packing (empty road), bookings (airplane window), guides (tropical beach), alerts (sunset bay)
- [x] Download and compress all 9 videos to under 5MB each using ffmpeg
- [x] Upload all 9 videos to CDN
- [x] Update VideoHeroContext with new CDN URLs
- [x] Audit dynamic switching: PortalLayout already wires all 8 routes to video contexts
- [x] Admin routes intentionally keep the same video (management tool, not immersive)
- [x] Test crossfade transitions: verified DAY BY DAY label shows on itinerary page

## Session 5 — Expanded Video Library & Random Rotation
- [x] Download 4-6 diverse videos per context: 5 landing, 5 dashboard, 5 itinerary, 6 documents, 6 messages, 6 packing, 6 bookings, 6 guides, 6 alerts (44 total)
- [x] Compress all new videos to under 5MB each using ffmpeg
- [x] Upload all 44 videos to CDN (100% success)
- [x] Refactor VideoHeroContext: VIDEO_CATALOG is now Record<string, VideoEntry[]>
- [x] Implement random video selection (pickRandom) per context on each navigation
- [x] Test all 9 contexts: TypeScript clean, 21 tests passing

## Session 6 — Email Invites, Trip Builder, Multi-Trip Selector

### Email Delivery for Invites
- [x] Integrate Resend API for transactional email (RESEND_API_KEY validated, test email confirmed)
- [x] Send branded invite email with magic link when admin clicks "Send Portal Invite"
- [x] Email template: Next Chapter Travel branding, client name, CTA button, 7-day expiry notice
- [x] Show "Email sent" / "Copy link" status in invite dialog after send
- [x] RESEND_API_KEY added to secrets via webdev_request_secrets

### Admin Trip Builder Wizard
- [x] 5-step wizard: Step 1 (Client + Destination), Step 2 (Dates + Notes), Step 3 (Itinerary Items), Step 4 (Packing List), Step 5 (Bookings + Review)
- [x] Step navigation with progress indicator (numbered steps + progress bar)
- [x] Uses existing tRPC procedures: trips.create, itinerary.create, packing.create, bookings.create
- [x] Wizard accessible from Admin → Trips → "Trip Builder" button
- [x] On completion: redirect to trip detail view
- [x] "Quick Create" button preserved for simple trip creation without wizard

### Multi-Trip Selector in Portal
- [x] TripContext: shared selected trip state across all portal pages
- [x] TripSwitcher component: compact dropdown in portal header, only shows with 2+ trips
- [x] TripProvider added to PortalLayout (wraps all portal pages)
- [x] Itinerary, PackingList, Bookings pages refactored to use TripContext
- [x] Trip selection persists across page navigation (no per-page reset)
- [x] Shows trip title + status badge in dropdown
- [x] 21 vitest tests passing, TypeScript clean

## Session 7 — External Link Integrations
- [x] TravelJoy trip inquiry form: hero CTA changed to "Plan My Trip" (opens TravelJoy in new tab), sticky mobile CTA updated, CTA section updated with dual buttons
- [x] Typeform agent application: "Join Our Team" link added to footer Quick Links (opens Typeform in new tab)
- [x] Facebook page link: all 6 Facebook links updated to correct URL (share/1BvCajFoBy/)
- [x] Footer contact section updated: facebook.com/jessica.hoffman.520 → "Next Chapter Travel on Facebook"
- [x] "Plan My Trip" added to footer Quick Links
- [x] 21 vitest tests passing, TypeScript clean

## Session 8 — Plan My Trip Embedded Page
- [x] Create /plan-my-trip page with embedded TravelJoy iframe
- [x] Add branded header, subheading, and trust badges above the form (Disney, NCL, Royal Caribbean, Carnival)
- [x] Add route to App.tsx
- [x] Update all "Plan My Trip" CTAs (hero, sticky mobile, CTA section, footer) to use internal /plan-my-trip route
- [x] Set video context for the page (landing video)

## Session 9 — Partnership Correction & Wendy's Page
- [x] Inspect thenextchaptertravel.com: Wendy is founder/CEO, curates luxury all-women group trips, 20+ countries, educator/travel consultant background
- [x] Fix all "Owner & CEO" references for Jessica → "CFO & Certified Travel Specialist"
- [x] Added partnership callout box in About section: links to thenextchaptertravel.com, names Wendy as CEO
- [x] Updated hero subheading, About bio, CTA section, footer description, footer contact, PlanMyTrip trust badge
- [x] Footer contact now shows thenextchaptertravel.com link with (CEO: Wendy) label
- [x] TypeScript clean, 0 errors

## Session 10 — Video Loading Aesthetics
- [x] Add animated loading skeleton to GlobalVideoBackground (spinning loader + "Loading your journey..." text)
- [x] Enhance gradient overlay: from-black/70 via-black/40 to-black/80 + stronger vignette
- [x] Optimize video preloading: preload all video pools on PortalLayout mount, stagger with 500ms delay
- [x] Add onLoadedData handlers to both video slots to clear loading state
- [x] 21 vitest tests passing, TypeScript clean
