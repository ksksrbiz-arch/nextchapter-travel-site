import { useState } from "react";
import {
  Gift,
  Plus,
  Trash2,
  Compass,
  Award,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface LoyaltyAccount {
  id: string;
  programName: string;
  accountNumber: string;
  memberLevel: string;
  balance: number;
  pointsTier: "Silver" | "Gold" | "Platinum" | "Elite";
  issuerName: string;
  expiryDate?: string;
  website?: string;
  notes?: string;
  lastUpdated: string;
  recentActivity: {
    date: string;
    points: number;
    description: string;
  }[];
}

const LOYALTY_PROGRAMS = [
  "Airlines",
  "Hotel Chains",
  "Car Rentals",
  "Credit Cards",
  "Restaurant",
  "Retail",
  "Gas Stations",
  "Coffee Shops",
];

const MEMBER_LEVELS = [
  "Standard",
  "Silver",
  "Gold",
  "Platinum",
  "Elite",
  "VIP",
];

export function LoyaltyProgramTracker() {
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([
    {
      id: "1",
      programName: "United Airlines MileagePlus",
      accountNumber: "UTC000123456",
      memberLevel: "Gold",
      balance: 125000,
      pointsTier: "Gold",
      issuerName: "United Airlines",
      expiryDate: "2026-12-31",
      website: "www.mileageplus.com",
      lastUpdated: new Date().toISOString(),
      recentActivity: [
        {
          date: "2026-03-10",
          points: 5000,
          description: "Flight booking: NYC-LAX",
        },
        { date: "2026-03-05", points: 3000, description: "Partner purchase" },
        { date: "2026-02-28", points: 2500, description: "Credit card bonus" },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    programName: "",
    accountNumber: "",
    memberLevel: "Standard",
    balance: "",
    pointsTier: "Silver" as const,
    issuerName: "",
    expiryDate: "",
    website: "",
    category: "Airlines",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.programName.trim())
      newErrors.programName = "Program name required";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number required";
    if (!formData.issuerName.trim())
      newErrors.issuerName = "Issuer name required";
    if (!formData.balance || isNaN(parseFloat(formData.balance)))
      newErrors.balance = "Valid points required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAccount = () => {
    if (!validateForm()) return;

    const newAccount: LoyaltyAccount = {
      id: Date.now().toString(),
      programName: formData.programName,
      accountNumber: formData.accountNumber,
      memberLevel: formData.memberLevel,
      balance: parseFloat(formData.balance),
      pointsTier: formData.pointsTier,
      issuerName: formData.issuerName,
      expiryDate: formData.expiryDate,
      website: formData.website,
      lastUpdated: new Date().toISOString(),
      recentActivity: [],
    };

    setAccounts([newAccount, ...accounts]);
    setFormData({
      programName: "",
      accountNumber: "",
      memberLevel: "Standard",
      balance: "",
      pointsTier: "Silver",
      issuerName: "",
      expiryDate: "",
      website: "",
      category: "Airlines",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const totalPoints = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalAccounts = accounts.length;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Silver":
        return "bg-slate-500/20 text-slate-300";
      case "Gold":
        return "bg-yellow-500/20 text-yellow-300";
      case "Platinum":
        return "bg-cyan-500/20 text-cyan-300";
      case "Elite":
        return "bg-purple-500/20 text-purple-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Loyalty Balance Summary
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Programs</p>
            <p className="text-2xl font-bold text-foreground">
              {totalAccounts}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-blue-500/30">
            <p className="text-xs text-blue-300">Total Points</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalPoints.toLocaleString()}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg/Program</p>
            <p className="text-2xl font-bold text-foreground">
              {totalAccounts > 0
                ? Math.round(totalPoints / totalAccounts).toLocaleString()
                : "0"}
            </p>
          </div>
        </div>
      </Card>

      {/* Add Account Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Loyalty Account
        </Button>
      )}

      {/* Add Account Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">New Loyalty Account</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.programName}>
                <input
                  type="text"
                  placeholder="Program Name"
                  value={formData.programName}
                  onChange={e => {
                    setFormData({ ...formData, programName: e.target.value });
                    setErrors({ ...errors, programName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <select
                value={formData.category}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {LOYALTY_PROGRAMS.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.accountNumber}>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={e => {
                    setFormData({ ...formData, accountNumber: e.target.value });
                    setErrors({ ...errors, accountNumber: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.issuerName}>
                <input
                  type="text"
                  placeholder="Issuer Name"
                  value={formData.issuerName}
                  onChange={e => {
                    setFormData({ ...formData, issuerName: e.target.value });
                    setErrors({ ...errors, issuerName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.memberLevel}
                onChange={e =>
                  setFormData({ ...formData, memberLevel: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {MEMBER_LEVELS.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={formData.pointsTier}
                onChange={e =>
                  setFormData({
                    ...formData,
                    pointsTier: e.target.value as any,
                  })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="Silver">Silver Tier</option>
                <option value="Gold">Gold Tier</option>
                <option value="Platinum">Platinum Tier</option>
                <option value="Elite">Elite Tier</option>
              </select>
            </div>

            <FormFieldWrapper error={errors.balance}>
              <input
                type="number"
                placeholder="Current Balance (Points)"
                min="0"
                value={formData.balance}
                onChange={e => {
                  setFormData({ ...formData, balance: e.target.value });
                  setErrors({ ...errors, balance: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={e =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />

              <input
                type="url"
                placeholder="Website (optional)"
                value={formData.website}
                onChange={e =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddAccount} className="flex-1">
                Add Account
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

      {/* Accounts List */}
      {accounts.length > 0 ? (
        <div className="space-y-3">
          {accounts.map(account => (
            <Card key={account.id} className="p-4 border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">
                      {account.programName}
                    </h4>
                    <Badge
                      className={`text-xs ${getTierColor(account.pointsTier)}`}
                    >
                      {account.pointsTier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.issuerName}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-black/20 rounded-lg text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Account #</p>
                  <p className="font-mono font-semibold text-foreground">
                    {account.accountNumber}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Member Level</p>
                  <p className="font-medium text-foreground">
                    {account.memberLevel}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Current Balance
                  </p>
                  <p className="font-bold text-blue-400">
                    {account.balance.toLocaleString()} pts
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p
                    className={`font-medium ${account.expiryDate ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {account.expiryDate
                      ? new Date(account.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </p>
                </div>
              </div>

              {/* Links */}
              {account.website && (
                <div className="mb-3">
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Compass className="w-3 h-3" />
                    Visit Program Website
                  </a>
                </div>
              )}

              {/* Recent Activity */}
              {account.recentActivity.length > 0 && (
                <div className="border-t border-border/50 pt-3">
                  <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                    Recent Activity
                  </h5>
                  <div className="space-y-1">
                    {account.recentActivity.slice(0, 3).map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="text-foreground">
                            {activity.description}
                          </p>
                          <p className="text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                        <p className="font-semibold text-blue-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+{activity.points}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Gift}
            title="No Loyalty Accounts"
            description="Track your loyalty program points and tier status"
            action={{ label: "Add Account", onClick: () => setShowForm(true) }}
          />
        )
      )}
    </div>
  );
}
