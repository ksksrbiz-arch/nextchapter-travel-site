import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  Client,
  OperationalTrip,
  BusinessAnalytics,
} from "@/_core/services/businessOperations";

interface CRMDashboardProps {
  userId?: string;
}

export default function CRMDashboard({
  userId: _userId = "user-123",
}: CRMDashboardProps) {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [trips, setTrips] = React.useState<OperationalTrip[]>([]);
  const [analytics, setAnalytics] = React.useState<BusinessAnalytics | null>(
    null
  );
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<OperationalTrip | null>(
    null
  );
  const [view, setView] = useState<
    "overview" | "clients" | "trips" | "analytics"
  >("overview");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [healthScore, setHealthScore] = useState(0);

  // Initialize with mock data
  React.useEffect(() => {
    const mockClients: Client[] = [
      {
        id: "client-1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "555-0101",
        company: "Tech Startup Inc",
        preferences: {
          travelStyle: "luxury",
          budget: 15000,
          groupSize: 2,
          specialRequests: ["spa services", "private guides"],
        },
        totalSpent: 28500,
        tripsBooked: 3,
        lastBooking: Date.now() - 30 * 24 * 60 * 60 * 1000,
        status: "vip",
        notes: "Excellent communication, loves destination spas",
        createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
      },
      {
        id: "client-2",
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "555-0102",
        company: "Finance Corp",
        preferences: {
          travelStyle: "adventure",
          budget: 10000,
          groupSize: 4,
          specialRequests: ["outdoor activities", "local experiences"],
        },
        totalSpent: 9800,
        tripsBooked: 1,
        lastBooking: Date.now() - 120 * 24 * 60 * 60 * 1000,
        status: "at-risk",
        notes: "First-time booker, good candidate for upsell",
        createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
      },
      {
        id: "client-3",
        name: "Emma Rodriguez",
        email: "emma@example.com",
        phone: "555-0103",
        preferences: {
          travelStyle: "cultural",
          budget: 8000,
          groupSize: 2,
          specialRequests: ["cooking classes", "museum tours"],
        },
        totalSpent: 16400,
        tripsBooked: 2,
        lastBooking: Date.now() - 45 * 24 * 60 * 60 * 1000,
        status: "active",
        notes: "Repeat customer, values cultural immersion",
        createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
      },
    ];

    const mockTrips: OperationalTrip[] = [
      {
        id: "trip-1",
        clientId: "client-1",
        clientName: "Sarah Johnson",
        destination: "Bali",
        startDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        endDate: Date.now() + 37 * 24 * 60 * 60 * 1000,
        budget: 12000,
        status: "confirmed",
        itinerary: [
          {
            day: 1,
            activities: ["arrival", "spa"],
            accommodation: "Luxury Resort",
            notes: "VIP check-in",
          },
          {
            day: 2,
            activities: ["private guide tour"],
            accommodation: "Luxury Resort",
            notes: "",
          },
        ],
        assignedTeam: { concierge: "team-wendy" },
        expenses: {
          actual: 8500,
          budgeted: 12000,
          breakdown: { accommodation: 4200, activities: 3100, meals: 1200 },
        },
        satisfaction: 0,
        issues: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "trip-2",
        clientId: "client-3",
        clientName: "Emma Rodriguez",
        destination: "Paris",
        startDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
        endDate: Date.now() - 14 * 24 * 60 * 60 * 1000,
        budget: 8500,
        status: "completed",
        itinerary: [
          {
            day: 1,
            activities: ["museum tour"],
            accommodation: "Boutique Hotel",
            notes: "",
          },
          {
            day: 2,
            activities: ["cooking class"],
            accommodation: "Boutique Hotel",
            notes: "",
          },
        ],
        assignedTeam: { guide: "team-jessica" },
        expenses: {
          actual: 7900,
          budgeted: 8500,
          breakdown: { accommodation: 3500, activities: 2800, meals: 1600 },
        },
        satisfaction: 5,
        issues: [],
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now(),
      },
      {
        id: "trip-3",
        clientId: "client-2",
        clientName: "Michael Chen",
        destination: "Costa Rica",
        startDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
        endDate: Date.now() + 69 * 24 * 60 * 60 * 1000,
        budget: 11200,
        status: "planning",
        itinerary: [],
        assignedTeam: { concierge: "team-wendy", guide: "team-jessica" },
        expenses: { actual: 0, budgeted: 11200, breakdown: {} },
        satisfaction: 0,
        issues: ["Pending activity confirmations"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    setClients(mockClients);
    setTrips(mockTrips);
    setAnalytics({
      period: "month",
      totalClients: mockClients.length,
      totalTrips: mockTrips.length,
      totalRevenue: 156400,
      avgTripValue: 8200,
      avgClientSatisfaction: 4.7,
      growthRate: 12.5,
      churnRate: 2.1,
      repeatClientRate: 66,
      topDestinations: [
        { destination: "Miami", count: 12, revenue: 98400 },
        { destination: "Paris", count: 8, revenue: 65600 },
        { destination: "Tokyo", count: 6, revenue: 49200 },
      ],
      teamProductivity: {
        "Jessica Seiders": { tripsManaged: 45, satisfaction: 4.8 },
        Wendy: { tripsManaged: 52, satisfaction: 4.9 },
      },
      issues: [
        {
          description: "Delayed activity confirmations",
          severity: "medium",
          count: 3,
        },
        {
          description: "Client communication delays",
          severity: "low",
          count: 2,
        },
      ],
    });
    setHealthScore(82);
  }, []);

  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/50",
    vip: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    "at-risk": "bg-red-500/20 text-red-400 border-red-500/50",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };

  const tripStatusIcons = {
    planning: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    "in-progress": <Activity className="w-4 h-4" />,
    completed: <Star className="w-4 h-4" />,
    cancelled: <AlertCircle className="w-4 h-4" />,
  };

  const filteredClients =
    filterStatus === "all"
      ? clients
      : clients.filter(c => c.status === filterStatus);

  const filteredTrips =
    filterStatus === "all"
      ? trips
      : trips.filter(t => t.status === filterStatus);

  const activeTrips = trips.filter(
    t => t.status !== "completed" && t.status !== "cancelled"
  ).length;
  const _completedTrips = trips.filter(t => t.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Active Clients"
          value={filteredClients.length}
          color="blue"
        />
        <MetricCard
          icon={TrendingUp}
          label="Monthly Revenue"
          value={
            analytics?.totalRevenue
              ? `$${(analytics.totalRevenue / 1000).toFixed(0)}K`
              : "-"
          }
          color="green"
        />
        <MetricCard
          icon={Activity}
          label="Active Trips"
          value={activeTrips}
          color="purple"
        />
        <MetricCard
          icon={Star}
          label="Health Score"
          value={`${healthScore}/100`}
          color={
            healthScore >= 80 ? "green" : healthScore >= 60 ? "yellow" : "red"
          }
        />
      </div>

      {/* View Selector */}
      <div className="flex gap-2 flex-wrap">
        {(["overview", "clients", "trips", "analytics"] as const).map(v => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? "default" : "outline"}
            onClick={() => setView(v)}
            className="capitalize"
          >
            {v === "overview" && "📊"}
            {v === "clients" && "👥"}
            {v === "trips" && "✈️"}
            {v === "analytics" && "📈"} {v}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {view === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Business Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Overall Score</span>
                    <span className="font-bold">{healthScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        healthScore >= 80
                          ? "bg-green-500"
                          : healthScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Avg Satisfaction</p>
                    <p className="font-bold">
                      {analytics?.avgClientSatisfaction.toFixed(1)}/5.0
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Repeat Rate</p>
                    <p className="font-bold">
                      {analytics?.repeatClientRate.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Pending Issues
              </h3>
              <div className="space-y-2">
                {analytics?.issues.length ? (
                  analytics.issues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          issue.severity === "high"
                            ? "bg-red-500"
                            : issue.severity === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{issue.description}</p>
                        <p className="text-xs text-gray-400">
                          {issue.count} occurrence(s)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No major issues</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Destinations */}
          {analytics?.topDestinations && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Top Destinations
              </h3>
              <div className="space-y-3">
                {analytics.topDestinations.map((dest, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{dest.destination}</p>
                      <p className="text-xs text-gray-400">
                        {dest.count} trips • ${dest.revenue}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-24 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                          style={{
                            width: `${(dest.count / 12) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {view === "clients" && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Clients</option>
              <option value="active">Active</option>
              <option value="vip">VIP</option>
              <option value="at-risk">At Risk</option>
            </select>
            <Button size="sm" className="ml-auto">
              <Plus className="w-4 h-4 mr-1" />
              New Client
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredClients.map(client => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-blue-600/50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{client.name}</h4>
                    <Badge
                      className={
                        statusColors[client.status as keyof typeof statusColors]
                      }
                    >
                      {client.status.toUpperCase()}
                    </Badge>
                  </div>
                  <button className="p-1 hover:bg-gray-800 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />$
                    {client.totalSpent.toLocaleString()} spent •{" "}
                    {client.tripsBooked} trips
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {client.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {view === "trips" && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="all">All Trips</option>
              <option value="planning">Planning</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredTrips.map(trip => (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-blue-600/50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {trip.destination === "Bali" && "🏖️"}
                      {trip.destination === "Paris" && "🗼"}
                      {trip.destination === "Costa Rica" && "🌴"}
                      {trip.destination === "Tokyo" && "🗾"}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {trip.clientName} → {trip.destination}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {new Date(trip.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {
                      tripStatusIcons[
                        trip.status as keyof typeof tripStatusIcons
                      ]
                    }
                    <Badge className="bg-blue-500/20 text-blue-300 border-0 capitalize">
                      {trip.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 pt-2 border-t border-gray-800">
                  <div>
                    <p className="text-xs">Budget vs Actual</p>
                    <p className="font-semibold text-white">
                      ${trip.expenses.actual}/${trip.budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">Satisfaction</p>
                    <p className="font-semibold">{trip.satisfaction}/5</p>
                  </div>
                  <div>
                    <p className="text-xs">Issues</p>
                    <p className="font-semibold">{trip.issues.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {view === "analytics" && analytics && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="font-semibold mb-3">Monthly Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Revenue</span>
                <span className="font-semibold">
                  ${analytics.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Trip Value</span>
                <span className="font-semibold">
                  ${analytics.avgTripValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Growth Rate</span>
                <span className="font-semibold text-green-400">
                  +{analytics.growthRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Churn Rate</span>
                <span className="font-semibold text-red-400">
                  {analytics.churnRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="font-semibold mb-3">Team Performance</h3>
            <div className="space-y-3">
              {Object.entries(analytics.teamProductivity).map(
                ([name, stats]) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{name}</span>
                      <span className="text-xs text-gray-400">
                        {stats.satisfaction}/5.0★
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                        style={{ width: `${(stats.satisfaction / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modals */}
      {selectedClient && (
        <DetailModal
          title={selectedClient.name}
          onClose={() => setSelectedClient(null)}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-sm">{selectedClient.email}</p>
              <p className="text-sm">{selectedClient.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Travel Preferences</h4>
              <div className="text-sm space-y-1">
                <p>Style: {selectedClient.preferences.travelStyle}</p>
                <p>Budget: ${selectedClient.preferences.budget}</p>
                <p>Group Size: {selectedClient.preferences.groupSize}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">History</h4>
              <p className="text-sm">
                {selectedClient.tripsBooked} trips • $
                {selectedClient.totalSpent} total spent
              </p>
            </div>
            <Button className="w-full">Schedule Call</Button>
          </div>
        </DetailModal>
      )}

      {selectedTrip && (
        <DetailModal
          title={`${selectedTrip.clientName} - ${selectedTrip.destination}`}
          onClose={() => setSelectedTrip(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <Badge className="mt-1 capitalize">{selectedTrip.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-400">Budget vs Actual</p>
                <p className="font-semibold mt-1">
                  ${selectedTrip.expenses.actual}/${selectedTrip.budget}
                </p>
              </div>
            </div>
            {selectedTrip.itinerary.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Itinerary</h4>
                <div className="space-y-2">
                  {selectedTrip.itinerary.map((day, idx) => (
                    <div
                      key={idx}
                      className="text-sm bg-gray-800/50 p-2 rounded"
                    >
                      <p className="font-medium">Day {day.day}</p>
                      <p className="text-xs text-gray-400">
                        {day.activities.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedTrip.issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Issues</h4>
                <div className="space-y-1">
                  {selectedTrip.issues.map((issue, idx) => (
                    <p key={idx} className="text-sm text-yellow-400">
                      • {issue}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DetailModal>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClass = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    yellow: "from-yellow-500 to-orange-500",
    red: "from-red-500 to-rose-500",
  } as Record<string, string>;

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div
        className={`w-10 h-10 rounded bg-gradient-to-br ${colorClass[color]} flex items-center justify-center mb-2`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function DetailModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full">
        <div className="border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
