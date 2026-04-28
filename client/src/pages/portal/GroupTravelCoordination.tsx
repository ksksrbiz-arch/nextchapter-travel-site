import { useState } from "react";
import { Users, Plus, Trash2, CheckCircle2, Circle, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";
import {
  CabinAssignmentGrid,
  GroupManifest,
} from "@/components/GroupBookingEnhancements";

interface TravelCompanion {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "companion";
  status: "invited" | "accepted" | "declined";
  preferences?: string;
}

export function GroupTravelCoordination() {
  const [companions, setCompanions] = useState<TravelCompanion[]>([
    {
      id: "1",
      name: "Jessica Smith",
      email: "jessica@example.com",
      role: "organizer",
      status: "accepted",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "companion",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groupNotes, setGroupNotes] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompanion = () => {
    if (!validateForm()) return;

    const newCompanion: TravelCompanion = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role as "organizer" | "companion",
      status: "invited",
    };

    setCompanions([...companions, newCompanion]);
    setFormData({ name: "", email: "", role: "companion" });
    setErrors({});
    setShowForm(false);
  };

  const handleRemoveCompanion = (id: string) => {
    setCompanions(companions.filter(c => c.id !== id));
  };

  const acceptedCount = companions.filter(c => c.status === "accepted").length;
  const pendingCount = companions.filter(c => c.status === "invited").length;

  return (
    <div className="space-y-6">
      {/* Group Summary */}
      <Card className="bg-gradient-to-br from-violet-950/30 to-purple-950/30 border-violet-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Travel Group
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {companions.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-400">
              {acceptedCount}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-yellow-500/30">
            <p className="text-xs text-yellow-300">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
        </div>

        {/* Group Notes */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Group Notes
          </label>
          <textarea
            value={groupNotes}
            onChange={e => setGroupNotes(e.target.value)}
            placeholder="Important trip details everyone should know..."
            className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            rows={3}
          />
        </div>
      </Card>

      {/* Add Companion Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Invite Companion
        </Button>
      )}

      {/* Add Companion Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">
            Invite Travel Companion
          </h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.name}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.email}>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <select
              value={formData.role}
              onChange={e =>
                setFormData({
                  ...formData,
                  role: e.target.value as "organizer" | "companion",
                })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="companion">Companion</option>
              <option value="organizer">Co-Organizer</option>
            </select>

            <div className="flex gap-3">
              <Button onClick={handleAddCompanion} className="flex-1">
                Send Invitation
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

      {/* Companions List */}
      <div className="space-y-3">
        {companions.map(companion => (
          <Card key={companion.id} className="p-4 border-border/50">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {companion.name}
                  </h4>
                  <Badge
                    variant={
                      companion.role === "organizer" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {companion.role === "organizer" ? "Organizer" : "Companion"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <a
                    href={`mailto:${companion.email}`}
                    className="text-xs hover:text-primary transition-colors"
                  >
                    {companion.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {companion.status === "accepted" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-emerald-400">
                        Confirmed
                      </span>
                    </>
                  ) : companion.status === "invited" ? (
                    <>
                      <Circle className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-400">
                        Invitation Pending
                      </span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-400">Declined</span>
                    </>
                  )}
                </div>
              </div>

              {companion.role !== "organizer" && (
                <button
                  onClick={() => handleRemoveCompanion(companion.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Shared Resources */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Shared Resources</h3>

        <div className="space-y-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Travel Itinerary
            </p>
            <p className="text-sm font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
              📅 View Shared Itinerary
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Shared Documents
            </p>
            <p className="text-sm font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
              📄 Access Group Documents
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Split Expenses</p>
            <p className="text-sm font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
              💰 View Budget & Splits
            </p>
          </div>
        </div>
      </Card>

      {/* Group booking enhancements */}
      <CabinAssignmentGrid />
      <GroupManifest />

      {/* Collaboration Tips */}
      <Card className="border-blue-500/20 bg-blue-950/20 p-4">
        <h4 className="font-medium text-sm text-blue-400 mb-3">
          👥 Group Travel Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Share your itinerary with all companions</li>
          <li>• Agree on budget and expense splitting upfront</li>
          <li>• Set communication preferences and check-in times</li>
          <li>• Create backup contact plan for emergencies</li>
          <li>• Document preferences (dietary, activity level, pace)</li>
        </ul>
      </Card>
    </div>
  );
}
