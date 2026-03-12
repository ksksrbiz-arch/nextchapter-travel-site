import React, { useState } from 'react';
import {
  Send, Lightbulb, Zap, MessageSquare, TrendingUp, AlertCircle, Target,
  Users, Clock, Sparkles, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CopiloitInsight, AutomationSuggestion, ChatMessage } from '@/_core/services/aiCopilot';

interface AICopilotProps {
  userId?: string;
}

export default function AICopilot({ userId = 'user-123' }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [insights, setInsights] = useState<CopiloitInsight[]>([]);
  const [suggestions, setSuggestions] = useState<AutomationSuggestion[]>([]);
  const [userRole, setUserRole] = useState<'ceo' | 'cfo' | 'director' | 'team'>('cfo');
  const [view, setView] = useState<'chat' | 'insights' | 'suggestions'>('chat');
  const [healthScore, setHealthScore] = useState(82);
  const [loading, setLoading] = useState(false);

  // Initialize with welcome message and mock insights
  React.useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: '1',
      sender: 'copilot',
      message: `Welcome back! I'm your business intelligence assistant. As ${userRole === 'ceo' ? 'CEO' : userRole === 'cfo' ? 'CFO' : userRole === 'director' ? 'Director' : 'Team Member'}, I have ${3 + Math.floor(Math.random() * 2)} insights ready for you. How can I help optimize operations today?`,
      timestamp: Date.now(),
    };

    setMessages([welcomeMsg]);

    // Initialize insights
    const mockInsights: CopiloitInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Upsell Opportunity Detected',
        description: 'Michael Chen is a first-time customer with $9,800 spent. Recommend premium upgrade for his Costa Rica trip (+$2,000 expected value).',
        impact: 'medium',
        confidence: 0.88,
        suggestedAction: 'Send premium package proposal',
        relatedClient: 'client-2',
        relatedTrip: 'trip-3',
      },
      {
        id: '2',
        type: 'risk',
        title: 'At-Risk Client Detected',
        description: 'Sarah Johnson is a VIP client with 0 bookings in 5 months. Recommend re-engagement campaign to prevent churn.',
        impact: 'high',
        confidence: 0.92,
        suggestedAction: 'Schedule VIP check-in call',
        relatedClient: 'client-2',
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Team Workload Balancing',
        description: 'Jessica is managing 14 active trips (1.4x team average) while Wendy has 8. Consider reassigning upcoming bookings.',
        impact: 'medium',
        confidence: 0.85,
        suggestedAction: 'Review trip assignments',
      },
      {
        id: '4',
        type: 'alert',
        title: 'High-Value Destination Opportunity',
        description: 'Miami trips generate highest revenue ($98K/month). Consider creating exclusive Miami packages with 5-star partner resorts.',
        impact: 'high',
        confidence: 0.79,
        suggestedAction: 'Develop Miami luxury collection',
      },
    ];

    const mockSuggestions: AutomationSuggestion[] = [
      {
        id: '1',
        type: 'email',
        description: 'Welcome email for new client with travel preferences survey',
        targetClient: 'New Clients',
        priority: 'high',
        estimatedImpact: '+15% conversion on follow-up bookings',
        confidence: 0.95,
      },
      {
        id: '2',
        type: 'followup',
        description: 'Post-trip satisfaction survey with photo sharing request',
        targetTrip: 'Completed Trips',
        priority: 'high',
        estimatedImpact: '+8% repeat bookings',
        confidence: 0.92,
      },
      {
        id: '3',
        type: 'retention',
        description: 'VIP exclusive offers for clients inactive 3+ months',
        targetClient: 'VIP At-Risk',
        priority: 'medium',
        estimatedImpact: '+$5,200 revenue from retention',
        confidence: 0.87,
      },
      {
        id: '4',
        type: 'upsell',
        description: 'Premium add-on suggestions based on past trips and preferences',
        targetClient: 'Active Clients',
        priority: 'medium',
        estimatedImpact: '+$3,100 additional revenue per month',
        confidence: 0.81,
      },
      {
        id: '5',
        type: 'booking',
        description: 'Automated confirmations and itinerary delivery',
        targetTrip: 'Confirmed Trips',
        priority: 'high',
        estimatedImpact: '+12% guest satisfaction',
        confidence: 0.94,
      },
    ];

    setInsights(mockInsights);
    setSuggestions(mockSuggestions);
  }, [userRole]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: Date.now(),
      context: { role: userRole },
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setLoading(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const responses: Record<string, string> = {
        help: `I can help you with:
• **Insights**: Client at-risk detection, upsell opportunities, workload optimization
• **Automation**: Email campaigns, satisfaction surveys, retention offers
• **Analytics**: Revenue trends, destination performance, team productivity
• **Recommendations**: Strategic guidance for business growth

What would you like to focus on?`,
        client: `You have ${userRole === 'cfo' ? 45 : 52} active clients with:
• **VIP Tier**: 8 clients ($4.2M lifetime value)
• **At-Risk**: 3 clients (inactive 3+ months)
• **New**: 6 clients (last 30 days)
• **Satisfaction**: 4.7/5.0 average

Would you like recommendations for any specific segment?`,
        revenue: `Current revenue metrics:
• **Monthly**: $156,400 (+12.5% growth)
• **Per Trip**: $8,200 average
• **Growth Rate**: 12.5% (strong)
• **Repeat Clients**: 66% (excellent)

Top opportunities:
1. Miami packages (+$18K potential)
2. VIP retention (+$12K potential)
3. Premium tiers (+$8K potential)`,
        trip: `Current trip status:
• **Planning**: 8 trips (awaiting confirmations)
• **Confirmed**: 12 trips (next 60 days)
• **In Progress**: 3 trips (departing soon)
• **Completed**: 28 trips (avg satisfaction 4.8/5)

Critical: 3 trips have pending activity confirmations. Shall I escalate?`,
        team: `Team performance snapshot:
**Jessica Seiders (CFO)**
• Trips: 45 managed | Satisfaction: 4.8★ | Hours: 320

**Wendy (Director)**
• Trips: 52 managed | Satisfaction: 4.9★ | Hours: 420

Recommendation: Rebalance upcoming assignments to Jessica to prevent burnout.`,
        automation: `Top automation opportunities (confidence 92%+):
1. **Welcome emails** for new clients (95%)
2. **Booking confirmations** for all trips (94%)
3. **Satisfaction surveys** post-trip (92%)
4. **VIP retention offers** for at-risk clients (88%)

Ready to execute? I can schedule these today.`,
        goals: `Strategic recommendations based on your health score (${healthScore}/100):

**Growth Phase** (Current): 
• Focus on premium tier expansion
• Develop destination-specific packages
• Recruit team members (expanding trips)

**Next 90 Days**:
1. Launch Miami luxury collection
2. Implement VIP retention program
3. Develop adventure/cultural niche packages

Would you like detailed implementation plans?`,
      };

      let response = responses['help'];
      const msgLower = newMessage.toLowerCase();

      for (const [key, value] of Object.entries(responses)) {
        if (msgLower.includes(key)) {
          response = value;
          break;
        }
      }

      const copilotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        message: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, copilotMsg]);
      setLoading(false);
    }, 500 + Math.random() * 1000);
  };

  const impactColors = {
    'low': 'bg-blue-500/20 text-blue-300',
    'medium': 'bg-yellow-500/20 text-yellow-300',
    'high': 'bg-red-500/20 text-red-300',
  };

  const typeIcons = {
    'opportunity': <TrendingUp className="w-4 h-4" />,
    'risk': <AlertCircle className="w-4 h-4" />,
    'recommendation': <Lightbulb className="w-4 h-4" />,
    'alert': <Zap className="w-4 h-4" />,
  };

  const suggestionIcons = {
    'email': '📧',
    'booking': '✈️',
    'followup': '📞',
    'upsell': '⬆️',
    'retention': '💎',
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="font-semibold">Business Intelligence Co-pilot</h2>
          </div>
          <div className="text-sm text-gray-400">Health Score: {healthScore}/100</div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={view === 'chat' ? 'default' : 'outline'}
            onClick={() => setView('chat')}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Button>
          <Button
            size="sm"
            variant={view === 'insights' ? 'default' : 'outline'}
            onClick={() => setView('insights')}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Insights ({insights.length})
          </Button>
          <Button
            size="sm"
            variant={view === 'suggestions' ? 'default' : 'outline'}
            onClick={() => setView('suggestions')}
            className="gap-2"
          >
            <Zap className="w-4 h-4" />
            Suggestions ({suggestions.length})
          </Button>

          <select
            value={userRole}
            onChange={e => setUserRole(e.target.value as any)}
            className="ml-auto bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
          >
            <option value="ceo">CEO View</option>
            <option value="cfo">CFO View</option>
            <option value="director">Director View</option>
            <option value="team">Team Member View</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'chat' && (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'insights' && (
          <div className="space-y-3">
            {insights.map(insight => (
              <div key={insight.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-purple-600/50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="text-gray-400 mt-1">
                      {typeIcons[insight.type as keyof typeof typeIcons]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge className={impactColors[insight.impact as keyof typeof impactColors]}>
                    {insight.impact.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(insight.confidence * 100)}% confident
                  </Badge>
                  {insight.suggestedAction && (
                    <Button size="sm" className="ml-auto text-xs h-auto py-1">
                      {insight.suggestedAction}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.map(sugg => (
              <div key={sugg.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-blue-600/50 transition">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-lg">{suggestionIcons[sugg.type as keyof typeof suggestionIcons]}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{sugg.description}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {sugg.targetClient || sugg.targetTrip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-3">
                  <Badge className="bg-green-500/20 text-green-300 text-xs">
                    {sugg.estimatedImpact}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(sugg.confidence * 100)}% confidence
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      sugg.priority === 'high'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {sugg.priority.toUpperCase()}
                  </Badge>
                  <Button size="sm" className="ml-auto text-xs h-auto py-1">
                    Execute
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      {view === 'chat' && (
        <div className="border-t border-gray-800 p-4 bg-gray-900/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for insights, automation tips, or strategy..."
              disabled={loading}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Try asking about: revenue, clients, team, automation, goals, or help
          </p>
        </div>
      )}
    </div>
  );
}
