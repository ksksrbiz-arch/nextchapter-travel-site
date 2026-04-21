import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VideoHeroProvider } from "./contexts/VideoHeroContext";
import GlobalVideoBackground from "./components/GlobalVideoBackground";

// Public pages
import Home from "./pages/Home";
import JoinPage from "./pages/JoinPage";
import PlanMyTrip from "./pages/PlanMyTrip";
import { ThankYou } from "./pages/ThankYou";

// Client portal pages
import PortalDashboard from "./pages/portal/Dashboard";
import PortalItinerary from "./pages/portal/Itinerary";
import PortalDocuments from "./pages/portal/Documents";
import PortalMessages from "./pages/portal/Messages";
// Removed unused import - PortalPackingList
import PortalBookings from "./pages/portal/Bookings";
import PortalGuides from "./pages/portal/Guides";
import PortalAlerts from "./pages/portal/Alerts";
import TravelTimelinePage from "./pages/portal/TimelinePage";
import BudgetPage from "./pages/portal/BudgetPage";
import VisaPage from "./pages/portal/VisaPage";
import WeatherPage from "./pages/portal/WeatherPage";
import InsurancePage from "./pages/portal/InsurancePage";
import CurrencyPage from "./pages/portal/CurrencyPage";
import EmergencyPage from "./pages/portal/EmergencyPage";
import TravelDocumentsPage from "./pages/portal/TravelDocumentsPage";
import GroupTravelPage from "./pages/portal/GroupTravelPage";
import RecommendationsPage from "./pages/portal/RecommendationsPage";
import FlightTrackerPage from "./pages/portal/FlightTrackerPage";
import HotelPage from "./pages/portal/HotelPage";
import PackingPage from "./pages/portal/PackingPage";
import LoyaltyPage from "./pages/portal/LoyaltyPage";
import VaccinationPage from "./pages/portal/VaccinationPage";
import TranslationPage from "./pages/portal/TranslationPage";
import DocumentScannerPage from "./pages/portal/DocumentScannerPage";
import TravelInsurancePage from "./pages/portal/TravelInsurancePage";
import LocalCurrencyPage from "./pages/portal/LocalCurrencyPage";

// Phase 4: In-Trip Mobile Experience
import LiveItineraryPage from "./pages/portal/LiveItineraryPage";
import FamilyCheckInPage from "./pages/portal/FamilyCheckInPage";
import LocationAwareGuidesPage from "./pages/portal/LocationAwareGuidesPage";
import CrisisManagementPage from "./pages/portal/CrisisManagementPage";
import FlightAlternativesPage from "./pages/portal/FlightAlternativesPage";
import ExpenseTrackerPage from "./pages/portal/ExpenseTrackerPage";
import MemoryCurationPage from "./pages/portal/MemoryCurationPage";

// Phase 5: Memory Archives & Rebooking
import MemoryArchivesPage from "./pages/portal/MemoryArchivesPage";

// Phase 6: Business Operations & AI Co-pilot
import BusinessOperationsPage from "./pages/portal/BusinessOperationsPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  AdminClientsList,
  AdminClientDetail,
} from "./pages/admin/AdminClients";
import { AdminTripsList, AdminTripDetail } from "./pages/admin/AdminTrips";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminNotifications from "./pages/admin/AdminNotifications";
import TripBuilderWizard from "./pages/admin/TripBuilderWizard";

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
            <Router />
          </TooltipProvider>
        </VideoHeroProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
