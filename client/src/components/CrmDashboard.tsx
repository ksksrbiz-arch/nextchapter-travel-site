import React, { useState, useMemo } from "react";
import {
  Users,
  Plane,
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  MoreVertical,
} from "lucide-react";
import { businessOpsService } from "../_core/services/businessOperations";

// Statistics Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: "blue" | "green" | "purple" | "orange";
}> = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-sm text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );
};

// Client List Section
const ClientListSection: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "active" | "vip" | "at-risk">(
    "all"
  );
  const clients = businessOpsService.getAllClients();

  const filteredClients = useMemo(() => {
    if (filter === "all") return clients;
    return clients.filter(c => c.status === filter);
  }, [clients, filter]);

  const statusColor = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    vip: "bg-purple-100 text-purple-800",
    "at-risk": "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Clients ({filteredClients.length})
        </h3>
        <div className="flex gap-2">
          {["all", "active", "vip", "at-risk"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Trips
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Last Booking
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.slice(0, 10).map(client => (
              <tr
                key={client.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColor[client.status]}`}
                  >
                    {client.status.charAt(0).toUpperCase() +
                      client.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{client.email}</td>
                <td className="py-3 px-4 text-gray-900 font-semibold">
                  ${client.totalSpent.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {client.tripsBooked}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {client.lastBooking
                    ? new Date(client.lastBooking).toLocaleDateString()
                    : "Never"}
                </td>
                <td className="py-3 px-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No clients found</p>
        </div>
      )}
    </div>
  );
};

// Trip Operations Section
const TripOperationsSection: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const trips = businessOpsService.getAllTrips();

  const filteredTrips = useMemo(() => {
    if (statusFilter === "all") return trips;
    return trips.filter(t => t.status === statusFilter);
  }, [trips, statusFilter]);

  const statusColor = {
    planning: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Trip Operations ({filteredTrips.length})
        </h3>
        <div className="flex gap-2">
          {["all", "planning", "confirmed", "in-progress", "completed"].map(
            status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "in-progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Client
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Destination
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Dates
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Budget
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Actual
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.slice(0, 10).map(trip => {
              const daysLeft = Math.ceil(
                (trip.endDate.getTime() - trip.startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <tr
                  key={trip.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {trip.clientName}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {trip.destination}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {trip.startDate.toLocaleDateString()} -{" "}
                    {trip.endDate.toLocaleDateString()}
                    <span className="text-xs text-gray-500 ml-2">
                      ({daysLeft}d)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">
                    ${trip.budget.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">
                    ${trip.expenses.actual.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColor[trip.status as keyof typeof statusColor]}`}
                    >
                      {trip.status.charAt(0).toUpperCase() +
                        trip.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <Plane size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No trips found</p>
        </div>
      )}
    </div>
  );
};

// Team Performance Section
const TeamPerformanceSection: React.FC = () => {
  const teamMembers = businessOpsService.getAllTeamMembers();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Team Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers
          .filter(tm => ["ceo", "cfo", "director"].includes(tm.role))
          .map(member => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {member.role}
                  </p>
                </div>
                <Activity size={24} className="text-green-600" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Trips Managed</span>
                  <span className="font-semibold text-gray-900">
                    {member.performance.tripsManaged}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <span className="font-semibold text-gray-900">
                    {member.performance.clientSatisfaction.toFixed(1)}★
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Hours Logged</span>
                  <span className="font-semibold text-gray-900">
                    {member.performance.hoursLogged}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(member.performance.clientSatisfaction / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Analytics Summary Section
const AnalyticsSummarySection: React.FC = () => {
  const analytics = businessOpsService.generateAnalytics("month");
  const healthScore = businessOpsService.getHealthScore();

  const topDestinations = analytics.topDestinations.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Business Metrics
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Avg Trip Value</span>
            <span className="font-semibold text-gray-900">
              ${analytics.avgTripValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Repeat Client Rate</span>
            <span className="font-semibold text-gray-900">
              {(analytics.repeatClientRate * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Growth Rate</span>
            <span className="font-semibold text-green-600">
              {(analytics.growthRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-gray-600">Churn Rate</span>
            <span className="font-semibold text-orange-600">
              {(analytics.churnRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Avg Client Satisfaction</span>
            <span className="font-semibold text-gray-900">
              {analytics.avgClientSatisfaction.toFixed(1)}★
            </span>
          </div>
        </div>
      </div>

      {/* Top Destinations & Health Score */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Destinations
          </h3>
          <div className="space-y-3">
            {topDestinations.map((dest, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {dest.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${dest.revenue.toLocaleString()} revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {dest.count} trips
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Business Health
            </h3>
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {healthScore}
            </p>
            <p className="text-sm text-gray-600 mt-2">out of 100</p>
            <p className="text-xs text-gray-500 mt-3">
              {healthScore >= 85
                ? "🎯 Excellent"
                : healthScore >= 70
                  ? "✅ Healthy"
                  : healthScore >= 50
                    ? "⚠️ Improving"
                    : "🔴 Critical"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Issues Alert Section
const IssuesAlertSection: React.FC = () => {
  const analytics = businessOpsService.generateAnalytics("month");
  const issues = analytics.issues
    .filter(i => i.severity === "high")
    .slice(0, 5);

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle size={24} className="text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Issues & Alerts</h3>
      </div>

      <div className="space-y-2">
        {issues.map((issue, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-white rounded border border-red-100"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{issue.description}</p>
              <p className="text-sm text-gray-500">
                Occurred {issue.count}x this month
              </p>
            </div>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
              {issue.severity.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main CRM Dashboard Component
export const CrmDashboard: React.FC = () => {
  const clients = businessOpsService.getAllClients();
  const trips = businessOpsService.getAllTrips();
  const analytics = businessOpsService.generateAnalytics("month");
  const healthScore = businessOpsService.getHealthScore();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Operations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage clients, trips, and team performance
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            <Plus size={20} />
            New Client
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
            <Plane size={20} />
            New Trip
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={<Users />}
          color="blue"
          trend={`${Math.round(analytics.growthRate * 100)}% growth this month`}
        />
        <StatCard
          title="Active Trips"
          value={
            trips.filter(t => ["confirmed", "in-progress"].includes(t.status))
              .length
          }
          icon={<Plane />}
          color="green"
          trend={`${trips.length} total trips`}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(analytics.totalRevenue / 1000).toFixed(1)}K`}
          icon={<TrendingUp />}
          color="purple"
          trend={`Avg: $${Math.round(analytics.avgTripValue)}/trip`}
        />
        <StatCard
          title="Health Score"
          value={healthScore}
          icon={<Activity />}
          color="orange"
          trend={`${analytics.avgClientSatisfaction.toFixed(1)}★ satisfaction`}
        />
      </div>

      {/* Issues Alert */}
      <IssuesAlertSection />

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* Analytics Summary */}
        <AnalyticsSummarySection />

        {/* Team Performance */}
        <TeamPerformanceSection />

        {/* Client List */}
        <ClientListSection />

        {/* Trip Operations */}
        <TripOperationsSection />
      </div>
    </div>
  );
};

export default CrmDashboard;
