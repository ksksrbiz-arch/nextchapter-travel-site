import { useState } from "react";
import { Shield, Plus, Trash2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface InsurancePolicy {
  id: string;
  policyName: string;
  provider: string;
  policyNumber: string;
  coverageType: string[];
  startDate: string;
  endDate: string;
  maxCoverage: number;
  deductible: number;
  currency: string;
  premiumPaid: number;
  claimsAllowed: number;
  claimsUsed: number;
  emergencyPhone?: string;
  websiteUrl?: string;
  notes?: string;
  isActive: boolean;
  coverageRegions: string[];
}

const COVERAGE_TYPES = [
  "Medical Expenses",
  "Accident & Injury",
  "Emergency Evacuation",
  "Trip Cancellation",
  "Lost Luggage",
  "Travel Delays",
  "Personal Liability",
  "Dental Emergency",
  "Pre-existing Conditions",
  "Adventure Sports",
  "Equipment Cover",
  "Repatriation",
];

const REGIONS = [
  "Americas",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
  "Middle East",
  "Worldwide",
];

export function TravelInsuranceTracker() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    {
      id: "1",
      policyName: "Wanderlust Premium",
      provider: "Global Travel Insurance Co",
      policyNumber: "GTIP-2026-001",
      coverageType: [
        "Medical Expenses",
        "Emergency Evacuation",
        "Trip Cancellation",
        "Lost Luggage",
      ],
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      maxCoverage: 1000000,
      deductible: 500,
      currency: "USD",
      premiumPaid: 1200,
      claimsAllowed: 3,
      claimsUsed: 0,
      emergencyPhone: "+1-800-123-4567",
      websiteUrl: "www.globaltravelinsurance.com",
      notes: "Annual policy with 24/7 emergency support",
      isActive: true,
      coverageRegions: ["Americas", "Europe", "Asia"],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    policyName: "",
    provider: "",
    policyNumber: "",
    startDate: "",
    endDate: "",
    maxCoverage: "",
    deductible: "",
    currency: "USD",
    premiumPaid: "",
    claimsAllowed: "",
    emergencyPhone: "",
    websiteUrl: "",
    coverageType: [] as string[],
    coverageRegions: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.policyName.trim())
      newErrors.policyName = "Policy name required";
    if (!formData.provider.trim())
      newErrors.provider = "Provider name required";
    if (!formData.policyNumber.trim())
      newErrors.policyNumber = "Policy number required";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (!formData.maxCoverage || isNaN(parseFloat(formData.maxCoverage)))
      newErrors.maxCoverage = "Valid coverage required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPolicy = () => {
    if (!validateForm()) return;

    const newPolicy: InsurancePolicy = {
      id: Date.now().toString(),
      policyName: formData.policyName,
      provider: formData.provider,
      policyNumber: formData.policyNumber,
      coverageType: formData.coverageType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      maxCoverage: parseFloat(formData.maxCoverage),
      deductible: parseFloat(formData.deductible) || 0,
      currency: formData.currency,
      premiumPaid: parseFloat(formData.premiumPaid) || 0,
      claimsAllowed: parseInt(formData.claimsAllowed) || 5,
      claimsUsed: 0,
      emergencyPhone: formData.emergencyPhone,
      websiteUrl: formData.websiteUrl,
      isActive: new Date(formData.endDate) > new Date(),
      coverageRegions: formData.coverageRegions,
    };

    setPolicies([newPolicy, ...policies]);
    setFormData({
      policyName: "",
      provider: "",
      policyNumber: "",
      startDate: "",
      endDate: "",
      maxCoverage: "",
      deductible: "",
      currency: "USD",
      premiumPaid: "",
      claimsAllowed: "",
      emergencyPhone: "",
      websiteUrl: "",
      coverageType: [],
      coverageRegions: [],
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const toggleCoverage = (coverage: string) => {
    if (formData.coverageType.includes(coverage)) {
      setFormData({
        ...formData,
        coverageType: formData.coverageType.filter(c => c !== coverage),
      });
    } else {
      setFormData({
        ...formData,
        coverageType: [...formData.coverageType, coverage],
      });
    }
  };

  const toggleRegion = (region: string) => {
    if (formData.coverageRegions.includes(region)) {
      setFormData({
        ...formData,
        coverageRegions: formData.coverageRegions.filter(r => r !== region),
      });
    } else {
      setFormData({
        ...formData,
        coverageRegions: [...formData.coverageRegions, region],
      });
    }
  };

  const totalCoverage = policies.reduce((sum, p) => sum + p.maxCoverage, 0);
  const activePolicies = policies.filter(p => p.isActive).length;
  const totalClaims = policies.reduce((sum, p) => sum + p.claimsUsed, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Insurance Coverage Summary
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Active Policies</p>
            <p className="text-2xl font-bold text-foreground">
              {activePolicies}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-green-500/30">
            <p className="text-xs text-green-300">Total Coverage</p>
            <p className="text-2xl font-bold text-green-400">
              ${(totalCoverage / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Claims Used</p>
            <p className="text-2xl font-bold text-foreground">{totalClaims}</p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Policies</p>
            <p className="text-2xl font-bold text-foreground">
              {policies.length}
            </p>
          </div>
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
            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.policyName}>
                <input
                  type="text"
                  placeholder="Policy Name"
                  value={formData.policyName}
                  onChange={e => {
                    setFormData({ ...formData, policyName: e.target.value });
                    setErrors({ ...errors, policyName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.provider}>
                <input
                  type="text"
                  placeholder="Provider Name"
                  value={formData.provider}
                  onChange={e => {
                    setFormData({ ...formData, provider: e.target.value });
                    setErrors({ ...errors, provider: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

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

            <div className="grid grid-cols-3 gap-3">
              <FormFieldWrapper error={errors.maxCoverage}>
                <input
                  type="number"
                  placeholder="Max Coverage"
                  value={formData.maxCoverage}
                  onChange={e => {
                    setFormData({ ...formData, maxCoverage: e.target.value });
                    setErrors({ ...errors, maxCoverage: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <input
                type="number"
                placeholder="Deductible"
                value={formData.deductible}
                onChange={e =>
                  setFormData({ ...formData, deductible: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <select
                value={formData.currency}
                onChange={e =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>CAD</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Premium Paid"
                value={formData.premiumPaid}
                onChange={e =>
                  setFormData({ ...formData, premiumPaid: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <input
                type="number"
                placeholder="Claims Allowed"
                value={formData.claimsAllowed}
                onChange={e =>
                  setFormData({ ...formData, claimsAllowed: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={e =>
                  setFormData({ ...formData, emergencyPhone: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <input
                type="url"
                placeholder="Website URL"
                value={formData.websiteUrl}
                onChange={e =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Coverage Types */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Coverage Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COVERAGE_TYPES.map(coverage => (
                  <button
                    key={coverage}
                    onClick={() => toggleCoverage(coverage)}
                    className={`text-xs px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.coverageType.includes(coverage)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {coverage}
                  </button>
                ))}
              </div>
            </div>

            {/* Coverage Regions */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Coverage Regions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`text-xs px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.coverageRegions.includes(region)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddPolicy} className="flex-1">
                Add Policy
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
          {policies.map(policy => {
            const isExpired = new Date(policy.endDate) < new Date();
            const daysRemaining = Math.ceil(
              (new Date(policy.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={policy.id} className="p-4 border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        {policy.policyName}
                      </h4>
                      {policy.isActive && !isExpired && (
                        <Badge className="text-xs bg-emerald-500/20 text-emerald-300">
                          Active
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge className="text-xs bg-red-500/20 text-red-300">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {policy.provider}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Policy Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-black/20 rounded-lg text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Policy #</p>
                    <p className="font-mono font-semibold text-foreground">
                      {policy.policyNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                    <p
                      className={`font-medium ${isExpired ? "text-red-400" : daysRemaining <= 30 ? "text-amber-400" : "text-foreground"}`}
                    >
                      {new Date(policy.endDate).toLocaleDateString()} (
                      {daysRemaining} days)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Coverage Limit
                    </p>
                    <p className="font-bold text-green-400">
                      ${policy.maxCoverage.toLocaleString()} {policy.currency}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Premium Paid
                    </p>
                    <p className="font-medium text-foreground">
                      ${policy.premiumPaid}
                    </p>
                  </div>
                </div>

                {/* Claims Status */}
                <div className="mb-3 p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-blue-300 mb-2">
                    Claims Status
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      {policy.claimsUsed}/{policy.claimsAllowed} claims used
                    </span>
                    <div className="flex-1 ml-3 h-2 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{
                          width: `${(policy.claimsUsed / policy.claimsAllowed) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Coverage Types */}
                {policy.coverageType.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Coverage
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {policy.coverageType.slice(0, 4).map(coverage => (
                        <Badge
                          key={coverage}
                          variant="outline"
                          className="text-xs"
                        >
                          {coverage}
                        </Badge>
                      ))}
                      {policy.coverageType.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{policy.coverageType.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Coverage Regions */}
                {policy.coverageRegions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Regions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {policy.coverageRegions.map(region => (
                        <Badge
                          key={region}
                          variant="outline"
                          className="text-xs"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {policy.emergencyPhone && (
                  <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                    <AlertCircle className="w-4 h-4" />
                    <a
                      href={`tel:${policy.emergencyPhone}`}
                      className="font-medium"
                    >
                      {policy.emergencyPhone}
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Shield}
            title="No Insurance Policies"
            description="Add your travel insurance policies to track coverage and claims"
            action={{ label: "Add Policy", onClick: () => setShowForm(true) }}
          />
        )
      )}
    </div>
  );
}
