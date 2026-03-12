import React, { useState } from 'react';
import PortalLayout from '@/components/PortalLayout';
import CRMDashboard from '@/components/CRMDashboard';
import AICopilot from '@/components/AICopilot';
import { Button } from '@/components/ui/button';
import { Settings, Zap, LayoutDashboard } from 'lucide-react';

export default function BusinessOperationsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'copilot' | 'settings'>('dashboard');

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-blue-400" />
            Business Operations
          </h1>
          <p className="text-gray-400">
            Manage clients, operations, team performance, and get AI-powered insights to grow your business.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            CRM Dashboard
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'copilot'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            AI Copilot
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && <CRMDashboard userId="user-123" />}

          {activeTab === 'copilot' && <AICopilot userId="user-123" />}

          {activeTab === 'settings' && (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Business Operations Settings</h2>
                <p className="text-gray-400 text-sm">Configure automation preferences, team assignments, and integrations.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <h3 className="font-semibold mb-2">Automation Preferences</h3>
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Auto-send welcome emails to new clients</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer mt-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Send satisfaction surveys after completed trips</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer mt-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Enable VIP retention campaigns</span>
                  </label>
                </div>

                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <h3 className="font-semibold mb-2">Team Assignments</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Jessica Seiders (CFO)</span>
                      <Badge className="bg-blue-500/20 text-blue-300">45 trips</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Wendy (Director)</span>
                      <Badge className="bg-purple-500/20 text-purple-300">52 trips</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="mt-4">Add Team Member</Button>
                </div>

                <div className="bg-gray-800/50 rounded p-4 border border-gray-700">
                  <h3 className="font-semibold mb-2">Analytics & Reporting</h3>
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Weekly performance summary emails</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer mt-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Monthly revenue reports</span>
                  </label>
                </div>

                <Button className="w-full">Save Settings</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

// Badge component for inline use
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${className || 'bg-gray-700 text-gray-300'}`}
    >
      {children}
    </span>
  );
}
