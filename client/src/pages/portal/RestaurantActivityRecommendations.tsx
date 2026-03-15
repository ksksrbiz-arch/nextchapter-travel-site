import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Phone,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface Recommendation {
  id: string;
  type: "restaurant" | "activity" | "attraction";
  name: string;
  category: string;
  rating: number;
  price: string;
  address: string;
  hours?: string;
  phone?: string;
  website?: string;
  notes: string;
  saved: boolean;
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "1",
    type: "restaurant",
    name: "Sunset Grill",
    category: "Fine Dining",
    rating: 4.8,
    price: "$$$",
    address: "123 Ocean Avenue",
    hours: "5:00 PM - 11:00 PM",
    phone: "(555) 123-4567",
    website: "www.sunsetgrill.com",
    notes:
      "Beachfront location with amazing views. Recommended for sunset dinner.",
    saved: false,
  },
  {
    id: "2",
    type: "activity",
    name: "Snorkeling Tour",
    category: "Water Sports",
    rating: 4.9,
    price: "$$",
    address: "Beach Rentals Dock",
    hours: "7:00 AM - 4:00 PM",
    phone: "(555) 987-6543",
    website: "www.snorkeltours.com",
    notes: "Small group tours, includes equipment rental and lunch.",
    saved: false,
  },
  {
    id: "3",
    type: "attraction",
    name: "Island Cultural Center",
    category: "Museum",
    rating: 4.6,
    price: "$$",
    address: "456 Heritage Lane",
    hours: "10:00 AM - 6:00 PM",
    phone: "(555) 456-7890",
    website: "www.culturalcenter.com",
    notes: "Great for learning about local history.",
    saved: false,
  },
];

export function RestaurantActivityRecommendations() {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(MOCK_RECOMMENDATIONS);
  const [filter, setFilter] = useState<
    "all" | "restaurant" | "activity" | "attraction"
  >("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "restaurant",
    name: "",
    category: "",
    rating: "4.5",
    price: "$$",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.category) newErrors.category = "Category required";
    if (!formData.address) newErrors.address = "Address required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRecommendation = () => {
    if (!validateForm()) return;

    const newRec: Recommendation = {
      id: Date.now().toString(),
      type: formData.type as "restaurant" | "activity" | "attraction",
      name: formData.name,
      category: formData.category,
      rating: parseFloat(formData.rating),
      price: formData.price,
      address: formData.address,
      notes: formData.notes,
      saved: false,
    };

    setRecommendations([newRec, ...recommendations]);
    setFormData({
      type: "restaurant",
      name: "",
      category: "",
      rating: "4.5",
      price: "$$",
      address: "",
      notes: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleToggleSave = (id: string) => {
    setRecommendations(
      recommendations.map(r => (r.id === id ? { ...r, saved: !r.saved } : r))
    );
  };

  const handleDelete = (id: string) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  const filteredRecs =
    filter === "all"
      ? recommendations
      : recommendations.filter(r => r.type === filter);

  const savedCount = recommendations.filter(r => r.saved).length;

  const typeLabels = {
    restaurant: "🍽️ Restaurants",
    activity: "🎯 Activities",
    attraction: "🏛️ Attractions",
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Recommendations
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {recommendations.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Saved</p>
            <p className="text-2xl font-bold text-emerald-400">{savedCount}</p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-foreground">3</p>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "restaurant", "activity", "attraction"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all text-sm font-medium ${
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-border/80 text-muted-foreground"
            }`}
          >
            {f === "all" ? "All" : typeLabels[f as keyof typeof typeLabels]}
          </button>
        ))}
      </div>

      {/* Add Recommendation Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Recommendation
        </Button>
      )}

      {/* Add Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Add Recommendation</h3>

          <div className="space-y-4">
            <select
              value={formData.type}
              onChange={e =>
                setFormData({
                  ...formData,
                  type: e.target.value as
                    | "restaurant"
                    | "activity"
                    | "attraction",
                })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="restaurant">Restaurant</option>
              <option value="activity">Activity</option>
              <option value="attraction">Attraction</option>
            </select>

            <FormFieldWrapper error={errors.name}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.category}>
              <input
                type="text"
                placeholder="Category (e.g., Italian, Hiking, Museum)"
                value={formData.category}
                onChange={e => {
                  setFormData({ ...formData, category: e.target.value });
                  setErrors({ ...errors, category: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.address}>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={e => {
                  setFormData({ ...formData, address: e.target.value });
                  setErrors({ ...errors, address: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Rating (1-5)"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={e =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />

              <select
                value={formData.price}
                onChange={e =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option>$</option>
                <option>$$</option>
                <option>$$$</option>
                <option>$$$$</option>
              </select>
            </div>

            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={2}
            />

            <div className="flex gap-3">
              <Button onClick={handleAddRecommendation} className="flex-1">
                Save Recommendation
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

      {/* Recommendations List */}
      {filteredRecs.length > 0 ? (
        <div className="space-y-3">
          {filteredRecs.map(rec => (
            <Card
              key={rec.id}
              className="p-4 border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl flex-shrink-0">
                  {rec.type === "restaurant"
                    ? "🍽️"
                    : rec.type === "activity"
                      ? "🎯"
                      : "🏛️"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {rec.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="text-xs font-medium text-yellow-400">
                        {rec.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {rec.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.price}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {rec.address}
                    </div>
                    {rec.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {rec.hours}
                      </div>
                    )}
                    {rec.notes && <p className="italic">{rec.notes}</p>}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="flex gap-2">
                {rec.phone && (
                  <a
                    href={`tel:${rec.phone}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                )}
                {rec.website && (
                  <a
                    href={rec.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-xs font-medium flex items-center justify-center gap-2"
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
                <button
                  onClick={() => handleToggleSave(rec.id)}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-2 ${
                    rec.saved
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-black/20 hover:bg-black/30 text-muted-foreground"
                  }`}
                >
                  <Star
                    className="w-3 h-3"
                    fill={rec.saved ? "currentColor" : "none"}
                  />
                  {rec.saved ? "Saved" : "Save"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={MapPin}
            title="No Recommendations"
            description="Add restaurants, activities, and attractions you want to experience"
            action={{
              label: "Add Recommendation",
              onClick: () => setShowForm(true),
            }}
          />
        )
      )}
    </div>
  );
}
