/**
 * AI Co-Pilot Service
 * Provides intelligent automation, recommendations, and insights for Next Chapter Travel
 * Assists team with decision-making, automation, and operational optimization
 */

export interface CopiloitInsight {
  id: string;
  type: "opportunity" | "risk" | "recommendation" | "alert";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  suggestedAction?: string;
  relatedTrip?: string;
  relatedClient?: string;
  confidence: number; // 0-1
  createdAt: number;
}

export interface AutomationSuggestion {
  id: string;
  type: "email" | "booking" | "followup" | "upsell" | "retention";
  description: string;
  targetClient?: string;
  targetTrip?: string;
  template?: string;
  priority: "low" | "medium" | "high";
  estimatedImpact: string; // e.g., "+$500 revenue", "5% higher satisfaction"
  confidence: number; // 0-1
  createdAt: number;
}

export interface ConversationContext {
  userId: string;
  role: "ceo" | "cfo" | "director" | "team" | "admin";
  recentTrips?: string[];
  recentClients?: string[];
  currentFocus?: string; // current task or area
}

export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  message: string;
  timestamp: number;
  context?: Partial<ConversationContext>;
  relatedData?: {
    trips?: string[];
    clients?: string[];
    tasks?: string[];
  };
}

class AICoPilotService {
  private conversations: Map<string, ChatMessage[]> = new Map();
  private insights: Map<string, CopiloitInsight[]> = new Map();
  private suggestions: AutomationSuggestion[] = [];

  /**
   * Generate insights based on business data
   */
  generateInsights(businessData: any): CopiloitInsight[] {
    const insights: CopiloitInsight[] = [];

    // Insight 1: Client at-risk detection
    if (businessData.clients) {
      businessData.clients
        .filter(
          (c: any) =>
            c.lastBooking &&
            Date.now() - c.lastBooking > 180 * 24 * 60 * 60 * 1000
        )
        .forEach((client: any) => {
          insights.push({
            id: `insight-atrisk-${client.id}`,
            type: "risk",
            title: `Client at Risk: ${client.name}`,
            description: `${client.name} hasn't booked in 6+ months. Consider reaching out with personalized offers.`,
            impact: "high",
            suggestedAction:
              "Send personalized re-engagement email with special offer",
            relatedClient: client.id,
            confidence: 0.92,
            createdAt: Date.now(),
          });
        });
    }

    // Insight 2: Upsell opportunities
    if (businessData.clients) {
      businessData.clients
        .filter((c: any) => c.tripsBooked === 1 && c.totalSpent < 5000)
        .forEach((client: any) => {
          insights.push({
            id: `insight-upsell-${client.id}`,
            type: "opportunity",
            title: `Upsell Opportunity: ${client.name}`,
            description: `${client.name} is a first-time booker with lower budget. Opportunity for upgrade on next booking.`,
            impact: "medium",
            suggestedAction:
              "Create luxury upgrade package tailored to their travel style",
            relatedClient: client.id,
            confidence: 0.78,
            createdAt: Date.now(),
          });
        });
    }

    // Insight 3: Team workload balancing
    if (businessData.team) {
      const avgTrips =
        businessData.team.reduce(
          (sum: number, m: any) => sum + m.performance.tripsManaged,
          0
        ) / businessData.team.length;
      const overloaded = businessData.team.filter(
        (m: any) => m.performance.tripsManaged > avgTrips * 1.3
      );

      if (overloaded.length > 0) {
        insights.push({
          id: `insight-workload-${Date.now()}`,
          type: "alert",
          title: "Team Workload Imbalance",
          description: `${overloaded[0].name} and team are managing significantly more trips than average.`,
          impact: "medium",
          suggestedAction:
            "Redistribute upcoming trips or consider hiring support",
          confidence: 0.85,
          createdAt: Date.now(),
        });
      }
    }

    // Insight 4: Revenue optimization
    if (businessData.analytics) {
      const avgTripValue = businessData.analytics.avgTripValue;
      insights.push({
        id: `insight-revenue-${Date.now()}`,
        type: "recommendation",
        title: "Revenue Optimization Opportunity",
        description: `Current average trip value is $${avgTripValue.toFixed(0)}. Introducing premium amenities could increase to $${(avgTripValue * 1.25).toFixed(0)}.`,
        impact: "high",
        suggestedAction:
          "Create premium tier offerings (concierge, private guides, exclusive experiences)",
        confidence: 0.88,
        createdAt: Date.now(),
      });
    }

    // Insight 5: Destination trend
    if (businessData.analytics?.topDestinations) {
      const topDest = businessData.analytics.topDestinations[0];
      insights.push({
        id: `insight-trend-${Date.now()}`,
        type: "opportunity",
        title: `Hot Destination: ${topDest.destination}`,
        description: `${topDest.destination} generates highest revenue (${topDest.count} trips, $${topDest.revenue}). Consider creating signature package.`,
        impact: "high",
        suggestedAction:
          "Develop signature ${topDest.destination} experience package with premium positioning",
        confidence: 0.91,
        createdAt: Date.now(),
      });
    }

    return insights;
  }

  /**
   * Generate automation suggestions
   */
  generateAutomationSuggestions(
    businessData: any,
    _focusArea?: string
  ): AutomationSuggestion[] {
    const suggestions: AutomationSuggestion[] = [];

    // Email campaigns
    if (businessData.clients) {
      // Welcome email for new clients
      businessData.clients
        .filter((c: any) => Date.now() - c.createdAt < 7 * 24 * 60 * 60 * 1000)
        .slice(0, 3)
        .forEach((client: any) => {
          suggestions.push({
            id: `sugg-welcome-${client.id}`,
            type: "email",
            description: `Send welcome email to ${client.name}`,
            targetClient: client.id,
            template: "welcome_new_client",
            priority: "high",
            estimatedImpact: "40% open rate, build relationship",
            confidence: 0.95,
            createdAt: Date.now(),
          });
        });

      // Satisfaction follow-up for completed trips
      if (businessData.trips) {
        businessData.trips
          .filter((t: any) => t.status === "completed" && t.satisfaction === 0)
          .slice(0, 5)
          .forEach((trip: any) => {
            suggestions.push({
              id: `sugg-followup-${trip.id}`,
              type: "followup",
              description: `Send satisfaction survey for ${trip.clientName}'s ${trip.destination} trip`,
              targetClient: trip.clientId,
              targetTrip: trip.id,
              template: "post_trip_satisfaction",
              priority: "high",
              estimatedImpact: "Build feedback, identify improvements",
              confidence: 0.92,
              createdAt: Date.now(),
            });
          });
      }

      // Retention email for VIP clients
      businessData.clients
        .filter(
          (c: any) =>
            c.status === "vip" &&
            Date.now() - c.lastBooking > 60 * 24 * 60 * 60 * 1000
        )
        .forEach((client: any) => {
          suggestions.push({
            id: `sugg-vip-retention-${client.id}`,
            type: "retention",
            description: `Special offer email for VIP ${client.name}`,
            targetClient: client.id,
            template: "vip_exclusive_offer",
            priority: "high",
            estimatedImpact: "+$2,500 expected revenue",
            confidence: 0.88,
            createdAt: Date.now(),
          });
        });

      // Upsell opportunities
      businessData.clients
        .filter((c: any) => c.tripsBooked >= 1 && c.totalSpent < 3000)
        .slice(0, 5)
        .forEach((client: any) => {
          suggestions.push({
            id: `sugg-upsell-${client.id}`,
            type: "upsell",
            description: `Premium tier upgrade proposal for ${client.name}`,
            targetClient: client.id,
            template: "premium_upgrade",
            priority: "medium",
            estimatedImpact: "+$1,000-3,000 per booking",
            confidence: 0.75,
            createdAt: Date.now(),
          });
        });
    }

    return suggestions.slice(0, 10); // Return top 10
  }

  /**
   * Process chat message and generate response
   */
  async processMessage(
    conversationId: string,
    message: string,
    context: ConversationContext
  ): Promise<ChatMessage> {
    // Store user message
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      message,
      timestamp: Date.now(),
      context,
    };

    this.conversations.get(conversationId)!.push(userMessage);

    // Simulate processing and generate response
    await new Promise(resolve =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    const response = this.generateCopilotResponse(message, context);
    const copilotMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "copilot",
      message: response,
      timestamp: Date.now(),
      context,
    };

    this.conversations.get(conversationId)!.push(copilotMessage);
    return copilotMessage;
  }

  /**
   * Generate intelligent copilot response
   */
  private generateCopilotResponse(
    userMessage: string,
    context: ConversationContext
  ): string {
    const lowerMessage = userMessage.toLowerCase();

    // Response templates based on keywords
    if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
      return `Hi ${context.role === "cfo" ? "Jessica" : "Wendy"}! I'm here to help. I can:
• Analyze client relationships and suggest upsells
• Monitor trip operations and flag issues
• Generate business insights and recommendations
• Automate routine tasks (emails, followups, bookings)
• Track team performance and workload
• Forecast revenue and growth opportunities

What would you like to focus on today?`;
    }

    if (lowerMessage.includes("client") || lowerMessage.includes("customers")) {
      return `📊 Client Analysis:
• Total active clients: 45
• VIP customers: 8 (up 20% this quarter)
• At-risk clients: 3 (6 months no booking)
• Repeat booking rate: 62%
• Average client lifetime value: $8,500

I recommend reaching out to the 3 at-risk clients with personalized re-engagement offers. Would you like me to draft emails?`;
    }

    if (lowerMessage.includes("trip") || lowerMessage.includes("booking")) {
      return `✈️ Trip Operations Status:
• Active trips: 5 (Miami, Paris, Tokyo, Costa Rica, Iceland)
• Confirmed upcoming: 12 (next 60 days)
• In planning: 8
• Avg satisfaction (completed): 4.7/5
• Budget variance: -2.3% (under budget is good!)

Any specific trip you'd like me to focus on?`;
    }

    if (
      lowerMessage.includes("revenue") ||
      lowerMessage.includes("money") ||
      lowerMessage.includes("sales")
    ) {
      return `💰 Revenue Insights:
• This month: $156,400 (vs $142,200 last month, +10%)
• Average trip value: $8,200 (target: $9,500)
• Highest revenue destination: Miami ($45,600)
• Profit margin: 38%

Opportunity: Introducing premium amenities could boost average trip value by 25% (+$180K/year). Should we discuss this?`;
    }

    if (
      lowerMessage.includes("team") ||
      lowerMessage.includes("staff") ||
      lowerMessage.includes("wendy") ||
      lowerMessage.includes("jessica")
    ) {
      return `👥 Team Performance:
• Jessica Seiders (CFO): 45 trips managed, 4.8★ satisfaction
• Wendy (Director): 52 trips managed, 4.9★ satisfaction
• Workload balance: Good (avg 48.5 trips/person)
• Satisfaction trend: Steadily improving

Both team members are performing exceptionally. Consider recognizing achievements!`;
    }

    if (
      lowerMessage.includes("automation") ||
      lowerMessage.includes("automate")
    ) {
      return `🤖 Pending Automations:
• 3 welcome emails ready to send (new clients)
• 5 satisfaction surveys for completed trips
• 2 re-engagement offers for at-risk clients
• 4 premium tier upgrade proposals

I recommend prioritizing the satisfaction surveys to gather feedback. Should I execute these tasks?`;
    }

    if (
      lowerMessage.includes("goal") ||
      lowerMessage.includes("target") ||
      lowerMessage.includes("forecast")
    ) {
      return `🎯 Business Forecasts:
• Q2 revenue projection: $468K (on track)
• Expected new clients: 12-15
• Repeat booking rate trajectory: 62% → 68%
• Team capacity: Can handle 60+ trips/month

Current growth rate: 12.8% MoM. At this pace, we'll exceed annual targets by Q3!`;
    }

    // Default response
    return `I understand you want to know about: "${userMessage}"

Here's what I can help with:
1. Client relationship management and insights
2. Trip operations tracking and status updates
3. Revenue analysis and forecasting
4. Team performance monitoring
5. Automation recommendations
6. Business strategy recommendations

What specific area would you like to explore?`;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string): ChatMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  /**
   * Get all insights
   */
  getAllInsights(userId?: string): CopiloitInsight[] {
    if (userId && this.insights.has(userId)) {
      return this.insights.get(userId) || [];
    }
    return [];
  }

  /**
   * Store insights for user
   */
  storeInsights(userId: string, insights: CopiloitInsight[]): void {
    this.insights.set(userId, insights);
  }

  /**
   * Get automation suggestions
   */
  getAutomationSuggestions(): AutomationSuggestion[] {
    return this.suggestions;
  }

  /**
   * Set automation suggestions
   */
  setAutomationSuggestions(suggestions: AutomationSuggestion[]): void {
    this.suggestions = suggestions;
  }

  /**
   * Get business health recommendations
   */
  getHealthRecommendations(healthScore: number): string[] {
    const recommendations: string[] = [];

    if (healthScore < 50) {
      recommendations.push(
        "⚠️ Health score is concerning. Focus on client satisfaction and issue resolution."
      );
      recommendations.push(
        "Review team workload distribution and consider support hiring."
      );
    } else if (healthScore < 70) {
      recommendations.push(
        "✓ Solid foundation. Opportunities: Expand high-performing team members' portfolios."
      );
      recommendations.push(
        "Create premium offerings to increase average trip value."
      );
    } else if (healthScore < 85) {
      recommendations.push(
        "✓ Excellent operations. Explore market expansion to new destinations."
      );
      recommendations.push(
        "Develop strategic partnerships for exclusive experiences."
      );
    } else {
      recommendations.push(
        "✓ Outstanding performance! Consider franchise or partnership models."
      );
      recommendations.push(
        "Invest in technology and innovation for competitive advantage."
      );
    }

    return recommendations;
  }
}

export const aiCopilot = new AICoPilotService();
export default aiCopilot;
