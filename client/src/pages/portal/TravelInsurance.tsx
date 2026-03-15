import { useState } from "react";
import {
  Shield,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  coverage: string;
  premium: number;
  startDate: string;
  endDate: string;
  documentUrl?: string;
  status: "active" | "pending" | "expired";
}

const INSURANCE_PROVIDERS = [
  "World Nomads",
  "SafetyWing",
  "Allianz",
  "Travel Guard",
  "AXA",
  "Other",
];

const COVERAGE_TYPES = [
  "Medical Coverage",
  "trip Cancellation",
  "Trip Delay",
  "Baggage Loss",
  "Emergency Evacuation",
  "COVID-19 Coverage",
];

export function TravelInsurance() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    provider: "",
    policyNumber: "",
    coverage: "",
    premium: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.provider) newErrors.provider = "Provider required";
    if (!formData.policyNumber)
      newErrors.policyNumber = "Policy number required";
    if (!formData.coverage) newErrors.coverage = "Coverage type required";
    if (!formData.premium || isNaN(parseFloat(formData.premium)))
      newErrors.premium = "Valid amount required";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPolicy = () => {
    if (!validateForm()) return;

    const newPolicy: InsurancePolicy = {
      id: Date.now().toString(),
      provider: formData.provider,
      policyNumber: formData.policyNumber,
      coverage: formData.coverage,
      premium: parseFloat(formData.premium),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active",
    };

    setPolicies([newPolicy, ...policies]);
    setFormData({
      provider: "",
      policyNumber: "",
      coverage: "",
      premium: "",
      startDate: "",
      endDate: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const totalCoverage = policies.reduce((sum, p) => sum + p.premium, 0);

  return (
    <div className="space-y-6">
      {/* Insurance Overview */}
      <Card className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-500/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active Coverage
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                ${totalCoverage.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Premium
              </span>
            </div>
          </div>
          <Shield className="w-8 h-8 text-purple-500/60" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-2 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Policies</p>
            <p className="text-lg font-semibold text-foreground">
              {policies.length}
            </p>
          </div>
          <div className="p-2 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-lg font-semibold text-emerald-400">
              {policies.filter(p => p.status === "active").length}
            </p>
          </div>
          <div className="p-2 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-semibold text-yellow-400">
              {policies.filter(p => p.status === "pending").length}
            </p>
          </div>
        </div>
      </Card>

      {/* Recommended Coverage */}
      <Card className="border-blue-500/20 bg-blue-950/20 p-4">
        <h4 className="font-medium text-sm text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Essential Coverage for Your Trip
        </h4>
        <div className="space-y-2">
          {COVERAGE_TYPES.map(type => (
            <div
              key={type}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              {type}
            </div>
          ))}
        </div>
      </Card>

      {/* Add Policy Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Insurance Policy
        </Button>
      )}

      {/* Add Policy Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">New Insurance Policy</h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.provider}>
              <select
                value={formData.provider}
                onChange={e => {
                  setFormData({ ...formData, provider: e.target.value });
                  setErrors({ ...errors, provider: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">Select Provider</option>
                {INSURANCE_PROVIDERS.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.policyNumber}>
              <input
                type="text"
                placeholder="Policy Number"
                value={formData.policyNumber}
                onChange={e => {
                  setFormData({ ...formData, policyNumber: e.target.value });
                  setErrors({ ...errors, policyNumber: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.coverage}>
              <select
                value={formData.coverage}
                onChange={e => {
                  setFormData({ ...formData, coverage: e.target.value });
                  setErrors({ ...errors, coverage: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">Select Coverage Type</option>
                {COVERAGE_TYPES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.premium}>
              <input
                type="number"
                placeholder="Premium Amount"
                min="0"
                step="0.01"
                value={formData.premium}
                onChange={e => {
                  setFormData({ ...formData, premium: e.target.value });
                  setErrors({ ...errors, premium: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.startDate}>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => {
                    setFormData({ ...formData, startDate: e.target.value });
                    setErrors({ ...errors, startDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.endDate}>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => {
                    setFormData({ ...formData, endDate: e.target.value });
                    setErrors({ ...errors, endDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddPolicy} className="flex-1">
                Save Policy
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Policies List */}
      {policies.length > 0 ? (
        <div className="space-y-3">
          {policies.map(policy => (
            <Card key={policy.id} className="p-4 border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {policy.provider}
                    </h4>
                    <Badge
                      variant={
                        policy.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {policy.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {policy.coverage}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <p className="text-muted-foreground">Policy #</p>
                  <p className="font-mono text-foreground">
                    {policy.policyNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Premium</p>
                  <p className="font-semibold text-foreground">
                    ${policy.premium.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                Valid from {policy.startDate} to {policy.endDate}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Shield}
            title="No Insurance Policies"
            description="Add travel insurance to protect your trip"
            action={{ label: "Add Policy", onClick: () => setShowForm(true) }}
          />
        )
      )}
    </div>
  );
}
