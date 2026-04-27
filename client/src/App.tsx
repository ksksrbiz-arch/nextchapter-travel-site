import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VideoHeroProvider } from "./contexts/VideoHeroContext";
import GlobalVideoBackground from "./components/GlobalVideoBackground";
import RouteLoadingScreen from "./components/RouteLoadingScreen";

const lazyWithRetry = <T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
  key: string
): LazyExoticComponent<T> =>
  lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      // Retry once without forcing a full page reload so local app state is preserved.
      try {
        return await importer();
      } catch {
        throw error;
      }
    }
  });

// Public pages
const Home = lazyWithRetry(() => import("./pages/Home"), "home");
const JoinPage = lazyWithRetry(() => import("./pages/JoinPage"), "join");
const PlanMyTrip = lazyWithRetry(
  () => import("./pages/PlanMyTrip"),
  "plan-my-trip"
);
const ThankYou = lazyWithRetry(
  () =>
    import("./pages/ThankYou").then(module => ({ default: module.ThankYou })),
  "thank-you"
);
const NotFound = lazyWithRetry(() => import("./pages/NotFound"), "not-found");

// Client portal pages
const PortalDashboard = lazyWithRetry(
  () => import("./pages/portal/Dashboard"),
  "portal-dashboard"
);
const PortalItinerary = lazyWithRetry(
  () => import("./pages/portal/Itinerary"),
  "portal-itinerary"
);
const PortalDocuments = lazyWithRetry(
  () => import("./pages/portal/Documents"),
  "portal-documents"
);
const PortalMessages = lazyWithRetry(
  () => import("./pages/portal/Messages"),
  "portal-messages"
);
const PortalBookings = lazyWithRetry(
  () => import("./pages/portal/Bookings"),
  "portal-bookings"
);
const PortalGuides = lazyWithRetry(
  () => import("./pages/portal/Guides"),
  "portal-guides"
);
const PortalAlerts = lazyWithRetry(
  () => import("./pages/portal/Alerts"),
  "portal-alerts"
);
const TravelTimelinePage = lazyWithRetry(
  () => import("./pages/portal/TimelinePage"),
  "portal-timeline"
);
const BudgetPage = lazyWithRetry(
  () => import("./pages/portal/BudgetPage"),
  "portal-budget"
);
const VisaPage = lazyWithRetry(() => import("./pages/portal/VisaPage"), "portal-visa");
const WeatherPage = lazyWithRetry(
  () => import("./pages/portal/WeatherPage"),
  "portal-weather"
);
const InsurancePage = lazyWithRetry(
  () => import("./pages/portal/InsurancePage"),
  "portal-insurance"
);
const CurrencyPage = lazyWithRetry(
  () => import("./pages/portal/CurrencyPage"),
  "portal-currency"
);
const EmergencyPage = lazyWithRetry(
  () => import("./pages/portal/EmergencyPage"),
  "portal-emergency"
);
const TravelDocumentsPage = lazyWithRetry(
  () => import("./pages/portal/TravelDocumentsPage"),
  "portal-travel-documents"
);
const GroupTravelPage = lazyWithRetry(
  () => import("./pages/portal/GroupTravelPage"),
  "portal-group-travel"
);
const RecommendationsPage = lazyWithRetry(
  () => import("./pages/portal/RecommendationsPage"),
  "portal-recommendations"
);
const FlightTrackerPage = lazyWithRetry(
  () => import("./pages/portal/FlightTrackerPage"),
  "portal-flights"
);
const HotelPage = lazyWithRetry(() => import("./pages/portal/HotelPage"), "portal-hotel");
const PackingPage = lazyWithRetry(
  () => import("./pages/portal/PackingPage"),
  "portal-packing"
);
const LoyaltyPage = lazyWithRetry(
  () => import("./pages/portal/LoyaltyPage"),
  "portal-loyalty"
);
const VaccinationPage = lazyWithRetry(
  () => import("./pages/portal/VaccinationPage"),
  "portal-vaccination"
);
const TranslationPage = lazyWithRetry(
  () => import("./pages/portal/TranslationPage"),
  "portal-translation"
);
const DocumentScannerPage = lazyWithRetry(
  () => import("./pages/portal/DocumentScannerPage"),
  "portal-document-scanner"
);
const TravelInsurancePage = lazyWithRetry(
  () => import("./pages/portal/TravelInsurancePage"),
  "portal-insurance-tracker"
);
const LocalCurrencyPage = lazyWithRetry(
  () => import("./pages/portal/LocalCurrencyPage"),
  "portal-currency-converter"
);

// Phase 5: Memory Archives & Rebooking
const LiveItineraryPage = lazyWithRetry(
  () => import("./pages/portal/LiveItineraryPage"),
  "portal-live-itinerary"
);
const FamilyCheckInPage = lazyWithRetry(
  () => import("./pages/portal/FamilyCheckInPage"),
  "portal-family-checkin"
);
const LocationAwareGuidesPage = lazyWithRetry(
  () => import("./pages/portal/LocationAwareGuidesPage"),
  "portal-location-guides"
);
const CrisisManagementPage = lazyWithRetry(
  () => import("./pages/portal/CrisisManagementPage"),
  "portal-crisis-management"
);
const FlightAlternativesPage = lazyWithRetry(
  () => import("./pages/portal/FlightAlternativesPage"),
  "portal-flight-alternatives"
);
const ExpenseTrackerPage = lazyWithRetry(
  () => import("./pages/portal/ExpenseTrackerPage"),
  "portal-expense-tracker"
);
const MemoryCurationPage = lazyWithRetry(
  () => import("./pages/portal/MemoryCurationPage"),
  "portal-memory-curation"
);
const MemoryArchivesPage = lazyWithRetry(
  () => import("./pages/portal/MemoryArchivesPage"),
  "portal-memory-archives"
);

// Phase 6: Business Operations & AI Co-pilot
const BusinessOperationsPage = lazyWithRetry(
  () => import("./pages/portal/BusinessOperationsPage"),
  "portal-business-operations"
);

// Admin pages
const AdminDashboard = lazyWithRetry(
  () => import("./pages/admin/AdminDashboard"),
  "admin-dashboard"
);
const AdminClientsList = lazyWithRetry(
  () =>
    import("./pages/admin/AdminClients").then(module => ({
      default: module.AdminClientsList,
    })),
  "admin-clients-list"
);
const AdminClientDetail = lazyWithRetry(
  () =>
    import("./pages/admin/AdminClients").then(module => ({
      default: module.AdminClientDetail,
    })),
  "admin-client-detail"
);
const AdminTripsList = lazyWithRetry(
  () =>
    import("./pages/admin/AdminTrips").then(module => ({
      default: module.AdminTripsList,
    })),
  "admin-trips-list"
);
const AdminTripDetail = lazyWithRetry(
  () =>
    import("./pages/admin/AdminTrips").then(module => ({
      default: module.AdminTripDetail,
    })),
  "admin-trip-detail"
);
const AdminMessages = lazyWithRetry(
  () => import("./pages/admin/AdminMessages"),
  "admin-messages"
);
const AdminGuides = lazyWithRetry(
  () => import("./pages/admin/AdminGuides"),
  "admin-guides"
);
const AdminAlerts = lazyWithRetry(
  () => import("./pages/admin/AdminAlerts"),
  "admin-alerts"
);
const AdminNotifications = lazyWithRetry(
  () => import("./pages/admin/AdminNotifications"),
  "admin-notifications"
);
const TripBuilderWizard = lazyWithRetry(
  () => import("./pages/admin/TripBuilderWizard"),
  "admin-trip-builder"
);

function Router() {
  return (
    <Switch>
      {/* Public landing page */}
      <Route path="/" component={Home} />
      <Route path="/join" component={JoinPage} />
      <Route path="/plan-my-trip" component={PlanMyTrip} />
      <Route path="/plan" component={PlanMyTrip} />
      <Route path="/thank-you" component={ThankYou} />

      {/* Client portal */}
      <Route path="/portal" component={PortalDashboard} />
      <Route path="/portal/itinerary" component={PortalItinerary} />
      <Route path="/portal/timeline" component={TravelTimelinePage} />
      <Route path="/portal/documents" component={PortalDocuments} />
      <Route path="/portal/guides" component={PortalGuides} />
      <Route path="/portal/messages" component={PortalMessages} />
      <Route path="/portal/flights" component={FlightTrackerPage} />
      <Route path="/portal/hotel" component={HotelPage} />
      <Route path="/portal/packing" component={PackingPage} />
      <Route path="/portal/bookings" component={PortalBookings} />
      <Route path="/portal/alerts" component={PortalAlerts} />
      <Route path="/portal/budget" component={BudgetPage} />
      <Route path="/portal/visa" component={VisaPage} />
      <Route path="/portal/weather" component={WeatherPage} />
      <Route path="/portal/insurance" component={InsurancePage} />
      <Route path="/portal/currency" component={CurrencyPage} />
      <Route path="/portal/emergency" component={EmergencyPage} />
      <Route path="/portal/travel-documents" component={TravelDocumentsPage} />
      <Route path="/portal/group-travel" component={GroupTravelPage} />
      <Route path="/portal/recommendations" component={RecommendationsPage} />
      <Route path="/portal/loyalty" component={LoyaltyPage} />
      <Route path="/portal/vaccination" component={VaccinationPage} />
      <Route path="/portal/translation" component={TranslationPage} />
      <Route path="/portal/documents-vault" component={DocumentScannerPage} />
      <Route path="/portal/insurance-tracker" component={TravelInsurancePage} />
      <Route path="/portal/currency-converter" component={LocalCurrencyPage} />

      {/* Phase 4: In-Trip Mobile Experience */}
      <Route path="/portal/live-itinerary" component={LiveItineraryPage} />
      <Route path="/portal/family-checkin" component={FamilyCheckInPage} />
      <Route
        path="/portal/location-guides"
        component={LocationAwareGuidesPage}
      />
      <Route
        path="/portal/crisis-management"
        component={CrisisManagementPage}
      />
      <Route
        path="/portal/flight-alternatives"
        component={FlightAlternativesPage}
      />
      <Route path="/portal/expense-tracker" component={ExpenseTrackerPage} />

      {/* Phase 4.5: Post-Trip Memory Curation */}
      <Route path="/portal/memory-curation" component={MemoryCurationPage} />

      {/* Phase 5: Memory Archives & Rebooking */}
      <Route path="/portal/memory-archives" component={MemoryArchivesPage} />

      {/* Phase 6: Business Operations & AI Co-pilot */}
      <Route
        path="/portal/business-operations"
        component={BusinessOperationsPage}
      />

      {/* Admin dashboard */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/clients" component={AdminClientsList} />
      <Route path="/admin/clients/:id" component={AdminClientDetail} />
      <Route path="/admin/trips" component={AdminTripsList} />
      <Route path="/admin/trips/new" component={TripBuilderWizard} />
      <Route path="/admin/trips/:id" component={AdminTripDetail} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/guides" component={AdminGuides} />
      <Route path="/admin/alerts" component={AdminAlerts} />
      <Route path="/admin/notifications" component={AdminNotifications} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <VideoHeroProvider>
          <TooltipProvider>
            <Toaster />
            {/* Global cinematic video background — sits behind everything */}
            <GlobalVideoBackground />
            <Suspense fallback={<RouteLoadingScreen />}>
              <Router />
            </Suspense>
          </TooltipProvider>
        </VideoHeroProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
