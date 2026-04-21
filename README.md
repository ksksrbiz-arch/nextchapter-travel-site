# Next Chapter Travel — Client Portal & Admin

Modern travel concierge experience for Jessica Seiders, including a client portal, admin dashboard, and supporting Express + tRPC API. Built with Vite + React on the frontend and a TypeScript Node server that serves both the API and static assets.

## ✨ Features

### Client Portal
- 📅 **Trip Itinerary** - Day-by-day timeline with activities and bookings
- 📄 **Document Vault** - Secure storage for passports, tickets, confirmations
- 💬 **Real-time Messaging** - SSE-powered chat with travel advisor
- 🎒 **Smart Packing Lists** - Auto-generated, categorized checklists
- 🏨 **Booking Tracker** - Flights, hotels, tours, and transfers
- 🌍 **Destination Guides** - Local tips and emergency contacts
- 🏆 **Loyalty Tracker** - Manage rewards programs and points
- 💉 **Vaccination Records** - Track immunizations and requirements
- 💱 **Currency Simulator** - Real-time exchange rates
- 🛡️ **Travel Insurance Tracker** - Policy management and claims

### Admin Dashboard
- 👥 **Client Management** - CRM with trip history and preferences
- ✈️ **Trip Builder Wizard** - 5-step guided trip creation
- 📊 **Business Analytics** - Revenue forecasting and metrics
- 🔔 **Notification System** - Push notifications and email campaigns
- 📱 **Mobile-First Design** - PWA with offline capabilities
- 🎨 **Dynamic Video Backgrounds** - Context-aware cinematic experiences

## 🛠 Tech Stack

### Frontend
- **React 19.2** - Latest React with concurrent features
- **Vite 7.3** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first styling
- **tRPC 11.12** - End-to-end type safety
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight client-side routing
- **Radix UI** - Accessible component primitives

### Backend
- **Express 4.21** - Web server framework
- **tRPC 11.12** - Type-safe API layer
- **Drizzle ORM** - Type-safe SQL query builder
- **MySQL** - Relational database (PlanetScale/TiDB compatible)
- **JOSE** - JWT authentication
- **Server-Sent Events** - Real-time updates

### DevOps & Quality
- **TypeScript 5.9** - Strict type checking
- **Vitest 2.1** - Fast unit testing (21 tests passing ✅)
- **ESLint 9** - Code linting
- **Prettier 3.6** - Code formatting
- **Husky + lint-staged** - Git hooks for quality checks
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerized deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10.4.1+
- MySQL database (or compatible service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/t7451/nextchapter-travel-site.git
   cd nextchapter-travel-site
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Required variables:
   - `DATABASE_URL` - MySQL connection string
   - `JWT_SECRET` - Secret for JWT signing
   - `VITE_APP_ID` - Application identifier
   - `OAUTH_SERVER_URL` - OAuth server endpoint
   - `RESEND_API_KEY` - For transactional emails

4. **Run development server**
   ```bash
   pnpm dev
   ```
   Server starts on port 3000 (or next available port)

5. **Run tests**
   ```bash
   pnpm test
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production (client + server) |
| `pnpm start` | Run production build |
| `pnpm test` | Run test suite with Vitest |
| `pnpm lint` | Lint code with ESLint |
| `pnpm lint:fix` | Fix linting issues automatically |
| `pnpm check` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## 📁 Project Structure

```
nextchapter-travel-site/
├── .github/
│   └── workflows/       # CI/CD pipelines
├── client/
│   ├── public/          # Static assets
│   └── src/
│       ├── _core/       # Core services (AI, sync, notifications)
│       ├── components/  # React components
│       ├── contexts/    # React contexts
│       ├── hooks/       # Custom hooks
│       ├── lib/         # Utilities
│       ├── pages/       # Page components
│       │   ├── admin/   # Admin dashboard
│       │   └── portal/  # Client portal
│       └── App.tsx      # Main app
├── server/
│   ├── _core/           # Server core
│   ├── routers.ts       # tRPC routers
│   ├── db.ts            # Database utilities
│   ├── healthCheck.ts   # Health monitoring
│   ├── logger.ts        # Structured logging
│   └── rateLimit.ts     # Rate limiting
├── shared/              # Shared types
├── drizzle/             # Database migrations
└── tests/               # Test files
```

## 🚢 Deployment

### Architecture
- **Frontend**: Netlify CDN (static assets)
- **Backend**: Render Web Service (API)
- **Database**: PlanetScale / TiDB Cloud / Render MySQL
- **Storage**: AWS S3 via Manus built-in

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Feature roadmap
- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - Security audit report
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [PORTAL_IMPROVEMENTS.md](PORTAL_IMPROVEMENTS.md) - UX improvements
- [PERFORMANCE_CHECKLIST.md](PERFORMANCE_CHECKLIST.md) - Performance guide

## 🔒 Security

- ✅ JWT authentication with secure HTTP-only cookies
- ✅ Role-based access control (admin/client)
- ✅ Input validation via Zod schemas
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ Rate limiting on sensitive endpoints
- ✅ HTTPS enforced in production
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ PII redaction in logs

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for detailed security analysis.

## 🧪 Testing

All 21 tests passing ✅

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

Test coverage:
- ✅ Authentication flows
- ✅ tRPC procedures
- ✅ Invitation system
- ✅ Notification system
- ✅ Travel operations

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Commit using conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to your fork (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📋 Roadmap

Currently in **Phase 3** of 6-phase development plan:

- ✅ Phase 1: Multi-Family Management (Complete)
- ✅ Phase 2: Enterprise Booking Intelligence (Complete)
- 🚧 Phase 3: Pre-Trip Command Center (In Progress - 50%)
- 📅 Phase 4: In-Trip Mobile Experience (Q2-Q3 2026)
- 📅 Phase 5: Post-Trip & Retention (Q3-Q4 2026)
- 📅 Phase 6: Business Operations & AI Co-Pilot (Q4 2026 - Q2 2027)

See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for detailed timeline.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built for Next Chapter Travel LLC
- Wendy (CEO) & Jessica Seiders (CFO)
- Powered by modern web technologies

## 📞 Support

- 📧 Email: support@thenextchaptertravel.com
- 🌐 Website: [thenextchaptertravel.com](https://thenextchaptertravel.com)
- 📱 Facebook: [Next Chapter Travel](https://www.facebook.com/share/1BvCajFoBy/)

---

**Made with ❤️ for travelers and travel advisors**

