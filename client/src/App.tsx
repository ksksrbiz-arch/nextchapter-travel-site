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

// Client portal pages
import PortalDashboard from "./pages/portal/Dashboard";
import PortalItinerary from "./pages/portal/Itinerary";
import PortalDocuments from "./pages/portal/Documents";
import PortalMessages from "./pages/portal/Messages";
import PortalPackingList from "./pages/portal/PackingList";
import PortalBookings from "./pages/portal/Bookings";
import PortalGuides from "./pages/portal/Guides";
import PortalAlerts from "./pages/portal/Alerts";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminClientsList, AdminClientDetail } from "./pages/admin/AdminClients";
import { AdminTripsList, AdminTripDetail } from "./pages/admin/AdminTrips";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminNotifications from "./pages/admin/AdminNotifications";

function Router() {
  return (
    <Switch>
      {/* Public landing page */}
      <Route path="/" component={Home} />
      <Route path="/join" component={JoinPage} />

      {/* Client portal */}
      <Route path="/portal" component={PortalDashboard} />
      <Route path="/portal/itinerary" component={PortalItinerary} />
      <Route path="/portal/documents" component={PortalDocuments} />
      <Route path="/portal/messages" component={PortalMessages} />
      <Route path="/portal/packing" component={PortalPackingList} />
      <Route path="/portal/bookings" component={PortalBookings} />
      <Route path="/portal/guides" component={PortalGuides} />
      <Route path="/portal/alerts" component={PortalAlerts} />

      {/* Admin dashboard */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/clients" component={AdminClientsList} />
      <Route path="/admin/clients/:id" component={AdminClientDetail} />
      <Route path="/admin/trips" component={AdminTripsList} />
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
