import React, { useState, useRef, useEffect } from "react";
import { Send, Lightbulb, Zap, MoreVertical, ChevronDown } from "lucide-react";
import { aiCopilot } from "../_core/services/aiCopilot";
import { businessOpsService } from "../_core/services/businessOperations";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  message: string;
  timestamp: Date;
}

interface CopiloitInsight {
  id: string;
  type: "opportunity" | "risk" | "recommendation" | "alert";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  confidence: number;
  suggestedAction?: string;
}

interface AutomationSuggestion {
  id: string;
  type: "email" | "booking" | "followup" | "upsell" | "retention";
  description: string;
  priority: "low" | "medium" | "high";
  estimatedImpact: string;
  confidence: number;
  targetClient?: string;
  targetTrip?: string;
}

export const AICopilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "insights" | "automation"
  >("chat");
  const [userRole, setUserRole] = useState<"ceo" | "cfo" | "director">("ceo");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const insights = aiCopilot.generateInsights(
    businessOpsService.generateAnalytics("month")
  );
  const suggestions = aiCopilot.generateAutomationSuggestions(
    businessOpsService.generateAnalytics("month")
  );
  const healthScore = businessOpsService.getHealthScore();
  const healthRecommendations = aiCopilot.getHealthRecommendations(healthScore);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user" as const,
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const copilotResponse = aiCopilot.generateCopilotResponse(inputValue, {
        userRole,
        businessData: businessOpsService.generateAnalytics("month"),
      });

      const aiMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "copilot" as const,
        message: copilotResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">AI Co-Pilot</h2>
            <p className="text-blue-100 text-sm">
              Business intelligence & automation assistant
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Perspective:</p>
            <select
              value={userRole}
              onChange={e => setUserRole(e.target.value as typeof userRole)}
              className="mt-2 px-3 py-1 bg-white text-gray-900 rounded text-sm font-medium"
            >
              <option value="ceo">CEO View</option>
              <option value="cfo">CFO View</option>
              <option value="director">Director View</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {["chat", "insights", "automation"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab
                  ? "bg-white text-blue-600"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              {tab === "chat" && "💬 Chat"}
              {tab === "insights" && "💡 Insights"}
              {tab === "automation" && "⚙️ Automation"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-gray-700 font-medium">
                    Hello! I'm your AI Co-Pilot
                  </p>
                  <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
                    Ask me about your business performance, client insights,
                    automation opportunities, or get strategic recommendations.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Input */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about your business..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights Panel */}
        {activeTab === "insights" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4">
              {insights.map(insight => (
                <div
                  key={insight.id}
                  className={`border rounded-lg p-4 ${
                    insight.type === "opportunity"
                      ? "border-green-200 bg-green-50"
                      : insight.type === "risk"
                        ? "border-red-200 bg-red-50"
                        : insight.type === "recommendation"
                          ? "border-blue-200 bg-blue-50"
                          : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {insight.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        insight.impact === "high"
                          ? "bg-red-100 text-red-800"
                          : insight.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {insight.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {insight.description}
                  </p>
                  {insight.suggestedAction && (
                    <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-2 mt-2">
                      💡 {insight.suggestedAction}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-600">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${insight.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {insights.length === 0 && (
                <div className="text-center py-12">
                  <Lightbulb size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    No insights at this time
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Automation Panel */}
        {activeTab === "automation" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {suggestion.type}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        suggestion.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : suggestion.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {suggestion.priority.charAt(0).toUpperCase() +
                        suggestion.priority.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Estimated Impact:</span>
                      <span className="font-semibold text-gray-900">
                        {suggestion.estimatedImpact}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition">
                    Execute Action
                  </button>
                </div>
              ))}
              {suggestions.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Zap size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    No recommendations at this time
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar with Health Score & Recommendations */}
        <div className="w-72 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white mb-8">
            <p className="text-sm font-semibold text-white/80 mb-2">
              Business Health Score
            </p>
            <div className="text-5xl font-bold mb-2">{healthScore}</div>
            <p className="text-lg font-semibold text-white/90">
              {healthScore >= 85
                ? "🎯 Excellent"
                : healthScore >= 70
                  ? "✅ Healthy"
                  : healthScore >= 50
                    ? "⚠️ Improving"
                    : "🔴 Critical"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-600" />
              Strategic Recommendations
            </h3>

            <div className="space-y-3">
              {healthRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm text-blue-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">
              Quick Stats
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Insights</span>
                <span className="font-semibold text-gray-900">
                  {insights.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Suggestions</span>
                <span className="font-semibold text-gray-900">
                  {suggestions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
