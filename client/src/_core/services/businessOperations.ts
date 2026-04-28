/**
 * Business Operations Service
 * Manages client relationships, trip operations, financial tracking, and team coordination
 * Serves as the backbone for Next Chapter Travel's internal CRM system
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferences: {
    travelStyle: string; // luxury, adventure, cultural, relaxation, family
    budget: number;
    groupSize: number;
    allergies?: string[];
    specialRequests?: string[];
  };
  totalSpent: number;
  tripsBooked: number;
  lastBooking: number;
  status: "active" | "inactive" | "vip" | "at-risk";
  notes: string;
  createdAt: number;
}

export interface OperationalTrip {
  id: string;
  clientId: string;
  clientName: string;
  destination: string;
  startDate: number;
  endDate: number;
  budget: number;
  status: "planning" | "confirmed" | "in-progress" | "completed" | "cancelled";
  itinerary: {
    day: number;
    activities: string[];
    accommodation: string;
    notes: string;
  }[];
  assignedTeam: {
    concierge?: string;
    guide?: string;
    coordinator?: string;
  };
  expenses: {
    actual: number;
    budgeted: number;
    breakdown: Record<string, number>;
  };
  satisfaction: number; // 1-5
  issues: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "ceo" | "cfo" | "director" | "coordinator" | "guide" | "concierge";
  email: string;
  phone: string;
  department: string;
  assignedTrips: string[]; // trip IDs
  performance: {
    clientSatisfaction: number; // avg 1-5
    tripsManaged: number;
    hoursLogged: number;
  };
  createdAt: number;
}

export interface BusinessAnalytics {
  period: "month" | "quarter" | "year";
  totalClients: number;
  totalTrips: number;
  totalRevenue: number;
  avgTripValue: number;
  avgClientSatisfaction: number;
  growthRate: number; // percentage
  churnRate: number; // percentage
  repeatClientRate: number; // percentage
  topDestinations: Array<{
    destination: string;
    count: number;
    revenue: number;
  }>;
  teamProductivity: Record<
    string,
    { tripsManaged: number; satisfaction: number }
  >;
  issues: Array<{
    description: string;
    severity: "low" | "medium" | "high";
    count: number;
  }>;
}

export interface AutomationTask {
  id: string;
  type: "email" | "reminder" | "booking" | "followup" | "report";
  title: string;
  description: string;
  dueDate: number;
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  relatedTrip?: string;
  relatedClient?: string;
  createdAt: number;
}

class BusinessOperationsService {
  private clients: Map<string, Client> = new Map();
  private trips: Map<string, OperationalTrip> = new Map();
  private team: Map<string, TeamMember> = new Map();
  private tasks: Map<string, AutomationTask> = new Map();

  constructor() {
    this.initializeDefaultTeam();
  }

  /**
   * Initialize default team members (Jessica, Wendy, etc.)
   */
  private initializeDefaultTeam(): void {
    const defaultTeam: TeamMember[] = [
      {
        id: "team-jessica",
        name: "Jessica Seiders",
        role: "cfo",
        email: "seidersconsulting@gmail.com",
        phone: "1-555-0100",
        department: "Finance & Operations",
        assignedTrips: [],
        performance: {
          clientSatisfaction: 4.8,
          tripsManaged: 45,
          hoursLogged: 320,
        },
        createdAt: Date.now(),
      },
      {
        id: "team-wendy",
        name: "Wendy",
        role: "director",
        email: "wendy@nextchaptertravel.com",
        phone: "1-555-0101",
        department: "Operations & Coordination",
        assignedTrips: [],
        performance: {
          clientSatisfaction: 4.9,
          tripsManaged: 52,
          hoursLogged: 420,
        },
        createdAt: Date.now(),
      },
    ];

    defaultTeam.forEach(member => this.team.set(member.id, member));
  }

  /**
   * Add a new client
   */
  addClient(
    name: string,
    email: string,
    phone: string,
    preferences: Client["preferences"]
  ): Client {
    const client: Client = {
      id: `client-${Date.now()}`,
      name,
      email,
      phone,
      preferences,
      totalSpent: 0,
      tripsBooked: 0,
      lastBooking: 0,
      status: "active",
      notes: "",
      createdAt: Date.now(),
    };

    this.clients.set(client.id, client);
    return client;
  }

  /**
   * Create a new operational trip
   */
  createTrip(
    clientId: string,
    destination: string,
    startDate: number,
    endDate: number,
    budget: number
  ): OperationalTrip | null {
    const client = this.clients.get(clientId);
    if (!client) return null;

    const trip: OperationalTrip = {
      id: `trip-op-${Date.now()}`,
      clientId,
      clientName: client.name,
      destination,
      startDate,
      endDate,
      budget,
      status: "planning",
      itinerary: [],
      assignedTeam: {},
      expenses: { actual: 0, budgeted: budget, breakdown: {} },
      satisfaction: 0,
      issues: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.trips.set(trip.id, trip);
    client.tripsBooked++;
    client.lastBooking = Date.now();
    return trip;
  }

  /**
   * Update trip status
   */
  updateTripStatus(tripId: string, status: OperationalTrip["status"]): boolean {
    const trip = this.trips.get(tripId);
    if (trip) {
      trip.status = status;
      trip.updatedAt = Date.now();

      // Update client status based on trip progress
      if (status === "completed") {
        const client = this.clients.get(trip.clientId);
        if (client) {
          client.totalSpent += trip.expenses.actual;
          if (client.tripsBooked >= 2) {
            client.status = "vip";
          }
        }
      }

      return true;
    }
    return false;
  }

  /**
   * Track trip expenses
   */
  addExpense(tripId: string, category: string, amount: number): boolean {
    const trip = this.trips.get(tripId);
    if (trip) {
      trip.expenses.actual += amount;
      if (!trip.expenses.breakdown[category]) {
        trip.expenses.breakdown[category] = 0;
      }
      trip.expenses.breakdown[category] += amount;
      trip.updatedAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Assign team members to a trip
   */
  assignTeamToTrip(
    tripId: string,
    concierge?: string,
    guide?: string,
    coordinator?: string
  ): boolean {
    const trip = this.trips.get(tripId);
    if (!trip) return false;

    trip.assignedTeam = { concierge, guide, coordinator };

    // Update team member assignments
    [concierge, guide, coordinator].forEach(memberId => {
      if (memberId) {
        const member = this.team.get(memberId);
        if (member && !member.assignedTrips.includes(tripId)) {
          member.assignedTrips.push(tripId);
        }
      }
    });

    return true;
  }

  /**
   * Record trip satisfaction rating
   */
  recordSatisfaction(
    tripId: string,
    rating: number,
    issues?: string[]
  ): boolean {
    const trip = this.trips.get(tripId);
    if (trip) {
      trip.satisfaction = Math.min(5, Math.max(1, rating));
      if (issues) {
        trip.issues = issues;
      }

      // Update team member performance
      Object.values(trip.assignedTeam).forEach(memberId => {
        if (memberId) {
          const member = this.team.get(memberId);
          if (member) {
            const current = member.performance.clientSatisfaction;
            const count = member.performance.tripsManaged;
            member.performance.clientSatisfaction =
              (current * count + rating) / (count + 1);
          }
        }
      });

      return true;
    }
    return false;
  }

  /**
   * Get all clients
   */
  getAllClients(): Client[] {
    return Array.from(this.clients.values());
  }

  /**
   * Get all operational trips
   */
  getAllTrips(): OperationalTrip[] {
    return Array.from(this.trips.values());
  }

  /**
   * Get trips by status
   */
  getTripsByStatus(status: OperationalTrip["status"]): OperationalTrip[] {
    return Array.from(this.trips.values()).filter(t => t.status === status);
  }

  /**
   * Get team members
   */
  getTeamMembers(): TeamMember[] {
    return Array.from(this.team.values());
  }

  /**
   * Get team member by name
   */
  getTeamMemberByName(name: string): TeamMember | undefined {
    return Array.from(this.team.values()).find(
      m => m.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Generate business analytics
   */
  generateAnalytics(
    period: "month" | "quarter" | "year" = "month"
  ): BusinessAnalytics {
    const allClients = Array.from(this.clients.values());
    const allTrips = Array.from(this.trips.values());
    const allTeam = Array.from(this.team.values());

    const completedTrips = allTrips.filter(t => t.status === "completed");
    const totalRevenue = completedTrips.reduce(
      (sum, t) => sum + t.expenses.actual,
      0
    );
    const avgClientSatisfaction =
      completedTrips.length > 0
        ? completedTrips.reduce((sum, t) => sum + t.satisfaction, 0) /
          completedTrips.length
        : 0;

    // Top destinations
    const destinationMap = new Map<
      string,
      { count: number; revenue: number }
    >();
    completedTrips.forEach(trip => {
      if (!destinationMap.has(trip.destination)) {
        destinationMap.set(trip.destination, { count: 0, revenue: 0 });
      }
      const dest = destinationMap.get(trip.destination)!;
      dest.count++;
      dest.revenue += trip.expenses.actual;
    });

    const topDestinations = Array.from(destinationMap.entries())
      .map(([destination, { count, revenue }]) => ({
        destination,
        count,
        revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Team productivity
    const teamProductivity: Record<
      string,
      { tripsManaged: number; satisfaction: number }
    > = {};
    allTeam.forEach(member => {
      teamProductivity[member.name] = {
        tripsManaged: member.performance.tripsManaged,
        satisfaction: member.performance.clientSatisfaction,
      };
    });

    // Issues summary
    const issueMap = new Map<
      string,
      { count: number; severity: "low" | "medium" | "high" }
    >();
    allTrips.forEach(trip => {
      trip.issues.forEach(issue => {
        if (!issueMap.has(issue)) {
          const severity =
            trip.issues.length > 2
              ? "high"
              : trip.issues.length > 0
                ? "medium"
                : "low";
          issueMap.set(issue, { count: 0, severity });
        }
        const issueData = issueMap.get(issue)!;
        issueData.count++;
      });
    });

    const issues = Array.from(issueMap.entries())
      .map(([description, { count, severity }]) => ({
        description,
        severity,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const _activeClients = allClients.filter(
      c => c.status === "active" || c.status === "vip"
    ).length;
    const repeatClients = allClients.filter(c => c.tripsBooked > 1).length;

    return {
      period,
      totalClients: allClients.length,
      totalTrips: allTrips.length,
      totalRevenue,
      avgTripValue:
        completedTrips.length > 0 ? totalRevenue / completedTrips.length : 0,
      avgClientSatisfaction,
      growthRate: 12.5 + Math.random() * 5, // Mock growth
      churnRate: 5.2 + Math.random() * 2, // Mock churn
      repeatClientRate:
        allClients.length > 0 ? (repeatClients / allClients.length) * 100 : 0,
      topDestinations,
      teamProductivity,
      issues,
    };
  }

  /**
   * Create an automation task
   */
  createAutomationTask(
    type: AutomationTask["type"],
    title: string,
    dueDate: number,
    priority: "low" | "medium" | "high",
    relatedTrip?: string,
    relatedClient?: string
  ): AutomationTask {
    const task: AutomationTask = {
      id: `task-${Date.now()}`,
      type,
      title,
      description: `Automated ${type} task for Next Chapter Travel`,
      dueDate,
      priority,
      status: "pending",
      relatedTrip,
      relatedClient,
      createdAt: Date.now(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Get pending automation tasks
   */
  getPendingTasks(): AutomationTask[] {
    return Array.from(this.tasks.values()).filter(
      t => t.status === "pending" || t.status === "in-progress"
    );
  }

  /**
   * Mark task as complete
   */
  completeTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = "completed";
      return true;
    }
    return false;
  }

  /**
   * Get business health score (0-100)
   */
  getHealthScore(): number {
    const analytics = this.generateAnalytics("month");

    // Base score from satisfaction
    let score = analytics.avgClientSatisfaction * 20; // 0-20

    // Add for trip completion rate
    const completedTrips = this.getTripsByStatus("completed").length;
    const totalTrips = this.getAllTrips().length;
    if (totalTrips > 0) {
      score += (completedTrips / totalTrips) * 20; // 0-20
    }

    // Add for repeat client rate
    score += analytics.repeatClientRate / 5; // 0-20

    // Add for team satisfaction
    const avgTeamSatisfaction =
      Object.values(analytics.teamProductivity).reduce(
        (sum, p) => sum + p.satisfaction,
        0
      ) / Object.keys(analytics.teamProductivity).length;
    score += (avgTeamSatisfaction / 5) * 20; // 0-20

    // Subtract for unresolved issues
    score -= analytics.issues.length * 2;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

export const businessOpsService = new BusinessOperationsService();
export default businessOpsService;
