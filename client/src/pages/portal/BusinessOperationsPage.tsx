import React, { lazy, Suspense, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { BusinessOperationsSkeleton } from "@/components/ui/skeletons";

const CrmDashboard = lazy(() =>
  import("../../components/CrmDashboard").then(module => ({
    default: module.CrmDashboard,
  }))
);
const AICopilot = lazy(() =>
  import("../../components/AICopilot").then(module => ({
    default: module.AICopilot,
  }))
);

export default function BusinessOperationsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "copilot">(
    "dashboard"
  );

  return (
    <PortalLayout
      title="Business Operations"
      subtitle="Manage clients, operations, and get AI insights"
    >
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
        <Suspense fallback={<BusinessOperationsSkeleton />}>
          {activeTab === "dashboard" && <CrmDashboard />}
          {activeTab === "copilot" && <AICopilot />}
        </Suspense>
      </div>
      </div>
    </PortalLayout>
  );
}
