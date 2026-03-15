import { useState } from "react";
import { CheckCircle2, Circle, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-states";

interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  country: string;
  type: "required" | "recommended";
  completed: boolean;
  notes?: string;
}

const VISA_DATA: Record<string, DocumentRequirement[]> = {
  "United States": [
    {
      id: "1",
      title: "Valid Passport",
      description: "Passport valid for at least 6 months",
      country: "United States",
      type: "required",
      completed: false,
    },
    {
      id: "2",
      title: "ESTA or Visa",
      description: "Electronic travel authorization or B1/B2 visa",
      country: "United States",
      type: "required",
      completed: false,
    },
    {
      id: "3",
      title: "Vaccination Records",
      description: "COVID-19 vaccination proof (may be required)",
      country: "United States",
      type: "recommended",
      completed: false,
    },
  ],
  Mexico: [
    {
      id: "4",
      title: "Valid Passport",
      description: "Passport valid for entire stay",
      country: "Mexico",
      type: "required",
      completed: false,
    },
    {
      id: "5",
      title: "Travel Insurance",
      description: "Comprehensive travel medical insurance",
      country: "Mexico",
      type: "recommended",
      completed: false,
    },
  ],
  "Caribbean Islands": [
    {
      id: "6",
      title: "Valid Passport",
      description: "Passport valid for at least 6 months",
      country: "Caribbean Islands",
      type: "required",
      completed: false,
    },
    {
      id: "7",
      title: "Return Ticket",
      description: "Proof of return travel",
      country: "Caribbean Islands",
      type: "required",
      completed: false,
    },
    {
      id: "8",
      title: "Travel Funds",
      description: "Proof of sufficient funds for stay",
      country: "Caribbean Islands",
      type: "recommended",
      completed: false,
    },
  ],
};

export function VisaChecklist() {
  const [selectedCountry, setSelectedCountry] =
    useState<string>("United States");
  const [requirements, setRequirements] = useState<DocumentRequirement[]>(
    VISA_DATA["United States"] || []
  );
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setRequirements(VISA_DATA[country] || []);
  };

  const toggleRequirement = (id: string) => {
    setRequirements(
      requirements.map(req =>
        req.id === id ? { ...req, completed: !req.completed } : req
      )
    );
  };

  const updateNote = (id: string, note: string) => {
    setNotes({ ...notes, [id]: note });
  };

  const completedCount = requirements.filter(r => r.completed).length;
  const requiredCount = requirements.filter(r => r.type === "required").length;
  const completedRequired = requirements.filter(
    r => r.type === "required" && r.completed
  ).length;

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Select Destination</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.keys(VISA_DATA).map(country => (
            <button
              key={country}
              onClick={() => handleCountryChange(country)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCountry === country
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className="font-medium text-sm">{country}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Checklist Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Total Completed</span>
              <span className="font-semibold">
                {completedCount} of {requirements.length}
              </span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(completedCount / requirements.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Required Documents</span>
              <span className="font-semibold text-blue-400">
                {completedRequired} of {requiredCount}
              </span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(completedRequired / requiredCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Requirements List */}
      <div className="space-y-3">
        {requirements.length > 0 ? (
          requirements.map(req => (
            <Card key={req.id} className="p-4 border-border/50">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleRequirement(req.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {req.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`text-sm font-medium ${req.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                    >
                      {req.title}
                    </h4>
                    <Badge
                      variant={
                        req.type === "required" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {req.type === "required" ? "Required" : "Recommended"}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {req.description}
                  </p>

                  <textarea
                    placeholder="Add notes about this requirement..."
                    value={notes[req.id] || ""}
                    onChange={e => updateNote(req.id, e.target.value)}
                    className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No Requirements Found"
            description="Select a destination to see visa and documentation requirements"
          />
        )}
      </div>

      {/* Quick Tips */}
      {completedRequired === requiredCount && completedRequired > 0 && (
        <Card className="border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-1">
                All Required Documents Complete!
              </h4>
              <p className="text-xs text-muted-foreground">
                Don't forget to check embassy websites closest to your departure
                date for any updates.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
