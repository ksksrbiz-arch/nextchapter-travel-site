import React, { useState } from "react";
import { CrmDashboard } from "../../components/CrmDashboard";
import { AICopilot } from "../../components/AICopilot";

export default function BusinessOperationsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "copilot">(
    "dashboard"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Operations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage clients, operations, and get AI insights
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-6 py-3 font-medium text-lg transition border-b-2 ${
            activeTab === "dashboard"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("copilot")}
          className={`px-6 py-3 font-medium text-lg transition border-b-2 ${
            activeTab === "copilot"
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-gray-900"
          }`}
        >
          🤖 AI Co-Pilot
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === "dashboard" && <CrmDashboard />}
        {activeTab === "copilot" && <AICopilot />}
      </div>
    </div>
  );
}
