import React, { useState } from "react";
import {
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Zap,
  ChevronRight,
  Bookmark,
  Share2,
  Heart,
  Activity,
  Briefcase,
  TrendingUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import memoryArchives from "@/_core/services/memoryArchives";
import type { TripRecommendation } from "@/_core/services/memoryArchives";

interface RebookingRecommendationsProps {
  baseMemoryId?: string;
}

export default function RebookingRecommendations({
  baseMemoryId = "mem-orlando-2024",
}: RebookingRecommendationsProps) {
  const [recommendations, setRecommendations] = React.useState<
    TripRecommendation[]
  >([]);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<TripRecommendation | null>(null);
  const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set());
  const [filterByBudget, setFilterByBudget] = useState<
    "all" | "under" | "exact" | "over"
  >("all");
  const [filterByDuration, setFilterByDuration] = useState<
    "all" | "short" | "standard" | "extended"
  >("all");

  // Initialize with mock recommendations
  React.useEffect(() => {
    const mockRecommendations: TripRecommendation[] = [
      {
        id: "rec-1",
        title: "Return to Orlando",
        destination: "Orlando",
        description:
          "Experience Orlando again with fresh perspectives and new attractions that opened this year",
        reason: "You loved your previous trip to Orlando (excited experience)",
        confidence: 0.92,
        similarity: [
          "same destination",
          "family-friendly",
          "exciting atmosphere",
        ],
        estimatedBudget: 3200,
        duration: 10,
        bestSeason: "Winter",
        activities: ["theme parks", "entertainment", "dining"],
        accommodationType: "Resort Hotel",
        images: [
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
      {
        id: "rec-2",
        title: "Explore Tokyo",
        destination: "Tokyo",
        description:
          "Experience the vibrant energy of Tokyo with cutting-edge technology, traditional culture, and world-class dining",
        reason:
          "Based on your adventurous travel style and interest in entertainment",
        confidence: 0.85,
        similarity: [
          "adventurous spirit",
          "entertainment",
          "cultural exploration",
          "urban exploration",
        ],
        estimatedBudget: 2800,
        duration: 12,
        bestSeason: "Spring",
        activities: ["cultural sites", "food tours", "nightlife", "shopping"],
        accommodationType: "Boutique Hotel",
        images: [
          "https://images.unsplash.com/photo-1540959375944-7049177f343b?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
      {
        id: "rec-3",
        title: "Costa Rican Adventure",
        destination: "Costa Rica",
        description:
          "Discover lush rainforests, pristine beaches, and thrilling adventures in this natural paradise",
        reason:
          "Perfect match for your adventurous profile with outdoor activities",
        confidence: 0.88,
        similarity: [
          "adventure activities",
          "nature-focused",
          "active lifestyle",
          "eco-tourism",
        ],
        estimatedBudget: 2400,
        duration: 9,
        bestSeason: "December-April",
        activities: ["hiking", "zip-lining", "wildlife", "beaches"],
        accommodationType: "Eco-Lodge",
        images: [
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
      {
        id: "rec-4",
        title: "Greek Islands Escape",
        destination: "Greece",
        description:
          "Relax on stunning islands with Mediterranean charm, ancient history, and delicious cuisine",
        reason: "Ideal for a more relaxed travel style with cultural elements",
        confidence: 0.79,
        similarity: [
          "relaxation focus",
          "cultural heritage",
          "beaches",
          "culinary experiences",
        ],
        estimatedBudget: 2600,
        duration: 10,
        bestSeason: "May-June, September-October",
        activities: [
          "beach relaxation",
          "historical sites",
          "local food",
          "sailing",
        ],
        accommodationType: "Boutique Resort",
        images: [
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
      {
        id: "rec-5",
        title: "Thailand Cultural Tour",
        destination: "Thailand",
        description:
          "Immerse yourself in vibrant Thai culture, street food, temples, and island beaches",
        reason:
          "Combines adventure, culture, and budget-friendly travel based on your preferences",
        confidence: 0.83,
        similarity: [
          "cultural immersion",
          "food adventures",
          "exotic destinations",
          "value for money",
        ],
        estimatedBudget: 1800,
        duration: 11,
        bestSeason: "November-February",
        activities: ["temple tours", "food tours", "island hopping", "markets"],
        accommodationType: "Guesthouse/Hotel",
        images: [
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
      {
        id: "rec-6",
        title: "Paris Romantic Getaway",
        destination: "Paris",
        description:
          "Experience the magic of Paris with iconic landmarks, world-class museums, and charming cafes",
        reason:
          "Cultural enrichment and iconic experiences match your travel interests",
        confidence: 0.81,
        similarity: [
          "cultural attractions",
          "romance",
          "art and museums",
          "fine dining",
        ],
        estimatedBudget: 3100,
        duration: 8,
        bestSeason: "April-May, September-October",
        activities: [
          "museums",
          "historic sites",
          "art galleries",
          "fine dining",
        ],
        accommodationType: "Luxury Hotel",
        images: [
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300",
        ],
        bookingUrl: "https://example.com/book",
      },
    ];

    setRecommendations(mockRecommendations);
  }, []);

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterByBudget === "under" && rec.estimatedBudget > 2500) return false;
    if (
      filterByBudget === "exact" &&
      (rec.estimatedBudget < 2000 || rec.estimatedBudget > 3000)
    )
      return false;
    if (filterByBudget === "over" && rec.estimatedBudget < 3000) return false;

    if (filterByDuration === "short" && rec.duration > 7) return false;
    if (
      filterByDuration === "standard" &&
      (rec.duration < 8 || rec.duration > 12)
    )
      return false;
    if (filterByDuration === "extended" && rec.duration < 12) return false;

    return true;
  });

  const toggleSaveTrip = (tripId: string) => {
    setSavedTrips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tripId)) {
        newSet.delete(tripId);
      } else {
        newSet.add(tripId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Rebook Your Magic</h2>
        <p className="text-gray-400 mt-2">
          Based on your travel memories, here are personalized recommendations
          for your next adventure
        </p>
      </div>

      {/* Filter Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Budget Range
          </label>
          <div className="flex gap-2">
            {(["all", "under", "exact", "over"] as const).map(option => (
              <Button
                key={option}
                size="sm"
                variant={filterByBudget === option ? "default" : "outline"}
                onClick={() => setFilterByBudget(option)}
                className="capitalize flex-1"
              >
                {option === "under" && "Under $2.5K"}
                {option === "exact" && "$2-3K"}
                {option === "over" && "Over $3K"}
                {option === "all" && "All"}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trip Duration
          </label>
          <div className="flex gap-2">
            {(["all", "short", "standard", "extended"] as const).map(option => (
              <Button
                key={option}
                size="sm"
                variant={filterByDuration === option ? "default" : "outline"}
                onClick={() => setFilterByDuration(option)}
                className="capitalize flex-1"
              >
                {option === "short" && "1-7 days"}
                {option === "standard" && "8-12 days"}
                {option === "extended" && "12+ days"}
                {option === "all" && "All"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredRecommendations.map(rec => (
          <div
            key={rec.id}
            className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-600/50 transition group cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-48 bg-gray-800 overflow-hidden">
              <img
                src={rec.images[0]}
                alt={rec.destination}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className="bg-blue-500/80 border-0 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {(rec.confidence * 100).toFixed(0)}% Match
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title and Destination */}
              <div>
                <h3 className="font-bold text-lg">{rec.title}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {rec.destination}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 line-clamp-2">
                {rec.description}
              </p>

              {/* Reason */}
              <div className="bg-blue-900/20 border border-blue-800/30 rounded p-2">
                <p className="text-xs text-gray-300 italic">💡 {rec.reason}</p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <DetailPill icon={Calendar} label={`${rec.duration}d`} />
                <DetailPill
                  icon={DollarSign}
                  label={`$${rec.estimatedBudget}`}
                />
                <DetailPill icon={Activity} label={rec.accommodationType} />
              </div>

              {/* Activities */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Activities</p>
                <div className="flex flex-wrap gap-1">
                  {rec.activities.map(activity => (
                    <Badge
                      key={activity}
                      className="bg-green-500/20 text-green-300 border-green-500/50 text-xs"
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Best Season */}
              <p className="text-xs text-gold-400 flex items-center gap-1">
                ✨ Best season: {rec.bestSeason}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant={savedTrips.has(rec.id) ? "default" : "outline"}
                  onClick={() => toggleSaveTrip(rec.id)}
                  className={
                    savedTrips.has(rec.id) ? "bg-red-600 border-red-600" : ""
                  }
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      savedTrips.has(rec.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRecommendation(rec)}
                  className="flex-1"
                >
                  Details
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No recommendations match your filters</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your budget or duration filters
          </p>
        </div>
      )}

      {/* Saved Trips Counter */}
      {savedTrips.size > 0 && (
        <div className="sticky bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-blue-600 rounded-full px-6 py-3 flex items-center gap-2">
            <Bookmark className="w-5 h-5 fill-current" />
            <span>{savedTrips.size} trips saved</span>
            <Button size="sm" variant="ghost" className="ml-2">
              View Saved
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedRecommendation.title}
                </h2>
                <p className="text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {selectedRecommendation.destination}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Hero Image */}
              <img
                src={selectedRecommendation.images[0]}
                alt={selectedRecommendation.destination}
                className="w-full h-80 object-cover rounded-lg"
              />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">About This Trip</h3>
                <p className="text-gray-300">
                  {selectedRecommendation.description}
                </p>
              </div>

              {/* Why Recommended */}
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <p className="font-semibold mb-2">Why We Recommend This</p>
                <p className="text-gray-300">{selectedRecommendation.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRecommendation.similarity.map(sim => (
                    <Badge
                      key={sim}
                      className="bg-blue-500/30 text-blue-300 border-0 text-xs"
                    >
                      {sim}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailCard
                  icon={Calendar}
                  label="Duration"
                  value={`${selectedRecommendation.duration} days`}
                />
                <DetailCard
                  icon={DollarSign}
                  label="Estimated Budget"
                  value={`$${selectedRecommendation.estimatedBudget}`}
                />
                <DetailCard
                  icon={Activity}
                  label="Accommodation"
                  value={selectedRecommendation.accommodationType}
                />
                <DetailCard
                  icon={Zap}
                  label="Match Score"
                  value={`${(selectedRecommendation.confidence * 100).toFixed(0)}%`}
                />
              </div>

              {/* Activities */}
              <div>
                <h3 className="font-semibold mb-3">Top Activities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRecommendation.activities.map(activity => (
                    <div
                      key={activity}
                      className="bg-gray-800/50 rounded p-3 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="capitalize">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => toggleSaveTrip(selectedRecommendation.id)}
                  className={
                    savedTrips.has(selectedRecommendation.id)
                      ? "bg-red-600 border-red-600"
                      : ""
                  }
                >
                  <Bookmark
                    className={`w-4 h-4 mr-2 ${
                      savedTrips.has(selectedRecommendation.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                  {savedTrips.has(selectedRecommendation.id)
                    ? "Saved"
                    : "Save Trip"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(selectedRecommendation.bookingUrl, "_blank")
                  }
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailPill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="bg-gray-800/50 rounded px-2 py-1 flex items-center gap-1 justify-center">
      <Icon className="w-3 h-3" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold mt-1 text-sm">{value}</p>
    </div>
  );
}
