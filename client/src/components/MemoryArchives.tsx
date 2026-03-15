import React, { useState } from "react";
import {
  ArchiveIcon,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Zap,
  Search,
  ChevronRight,
  Clock,
  TrendingUp,
  Globe,
  Heart,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import memoryArchives from "@/_core/services/memoryArchives";
import type {
  ArchivedMemory,
  TripSearchMatch,
} from "@/_core/services/memoryArchives";

interface MemoryArchivesProps {
  userId?: string;
}

export default function MemoryArchives({
  userId = "user-123",
}: MemoryArchivesProps) {
  const [archives, setArchives] = React.useState<ArchivedMemory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<ArchivedMemory | null>(
    null
  );
  const [similarTrips, setSimilarTrips] = useState<TripSearchMatch[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "timeline">(
    "grid"
  );

  // Initialize with mock data
  React.useEffect(() => {
    const mockArchives: ArchivedMemory[] = [
      {
        id: "mem-orlando-2024",
        tripId: "trip-orlando-2024",
        tripName: "Orlando Magic Kingdom Adventure",
        destination: "Orlando",
        startDate: Date.now() - 86400000 * 60, // 60 days ago
        endDate: Date.now() - 86400000 * 50,
        archives: [
          {
            id: "archive-1",
            name: "Magical Moments",
            mediaIds: ["photo-1", "photo-2", "photo-3"],
            emotion: "excited",
            metadata: {
              createdAt: Date.now(),
              imageCount: 3,
              videoCount: 0,
              totalSize: 6000000,
            },
          },
        ],
        highlights: ["photo-1", "photo-2", "photo-3"],
        emotionalSummary: "excited",
        stats: {
          totalMedia: 42,
          totalAlbums: 3,
          duration: 10,
          avgDailyMood: 0.94,
        },
        createdAt: Date.now() - 86400000 * 50,
        lastAccessed: Date.now(),
      },
      {
        id: "mem-sf-2024",
        tripId: "trip-sf-2024",
        tripName: "San Francisco Coast & Culture",
        destination: "San Francisco",
        startDate: Date.now() - 86400000 * 120,
        endDate: Date.now() - 86400000 * 110,
        archives: [
          {
            id: "archive-2",
            name: "Golden Gate Views",
            mediaIds: ["photo-4", "photo-5"],
            emotion: "amazed",
            metadata: {
              createdAt: Date.now(),
              imageCount: 2,
              videoCount: 1,
              totalSize: 5000000,
            },
          },
        ],
        highlights: ["photo-4", "photo-5"],
        emotionalSummary: "amazed",
        stats: {
          totalMedia: 38,
          totalAlbums: 2,
          duration: 10,
          avgDailyMood: 0.88,
        },
        createdAt: Date.now() - 86400000 * 110,
        lastAccessed: Date.now() - 86400000 * 30,
      },
      {
        id: "mem-hawaii-2024",
        tripId: "trip-hawaii-2024",
        tripName: "Hawaiian Paradise",
        destination: "Hawaii",
        startDate: Date.now() - 86400000 * 200,
        endDate: Date.now() - 86400000 * 185,
        archives: [
          {
            id: "archive-3",
            name: "Beach Bliss",
            mediaIds: ["photo-6", "photo-7"],
            emotion: "relaxed",
            metadata: {
              createdAt: Date.now(),
              imageCount: 2,
              videoCount: 0,
              totalSize: 4000000,
            },
          },
        ],
        highlights: ["photo-6", "photo-7"],
        emotionalSummary: "relaxed",
        stats: {
          totalMedia: 35,
          totalAlbums: 2,
          duration: 15,
          avgDailyMood: 0.91,
        },
        createdAt: Date.now() - 86400000 * 185,
        lastAccessed: Date.now() - 86400000 * 60,
      },
    ];

    setArchives(mockArchives);
  }, []);

  const filteredArchives = searchQuery
    ? archives.filter(
        a =>
          a.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : archives;

  const handleSelectMemory = (memory: ArchivedMemory) => {
    setSelectedMemory(memory);
    // Simulate finding similar trips
    setSimilarTrips([
      {
        memoryId: "mem-sf-2024",
        tripName: "San Francisco Coast & Culture",
        destination: "San Francisco",
        score: 0.75,
        sharedActivities: ["dining", "culture", "sightseeing"],
        sharedEmotions: ["amazed", "grateful"],
      },
      {
        memoryId: "mem-hawaii-2024",
        tripName: "Hawaiian Paradise",
        destination: "Hawaii",
        score: 0.68,
        sharedActivities: ["beach", "relaxation", "nature"],
        sharedEmotions: ["relaxed", "grateful"],
      },
    ]);
  };

  const emotionEmoji = {
    happy: "😊",
    excited: "🤩",
    surprised: "😲",
    relaxed: "😌",
    adventurous: "🚀",
    tender: "💕",
    grateful: "🙏",
    amazed: "🤯",
  } as Record<string, string>;

  const stats =
    archives.length > 0
      ? {
          totalTrips: archives.length,
          totalDays: archives.reduce((sum, a) => sum + a.stats.duration, 0),
          totalMedia: archives.reduce((sum, a) => sum + a.stats.totalMedia, 0),
          avgMood: (
            (archives.reduce((sum, a) => sum + a.stats.avgDailyMood, 0) /
              archives.length) *
            100
          ).toFixed(0),
        }
      : null;

  return (
    <div className="space-y-8">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox
            label="Trips Archived"
            value={stats.totalTrips}
            icon={<Globe className="w-6 h-6 text-blue-400" />}
          />
          <StatBox
            label="Total Days"
            value={stats.totalDays}
            icon={<Calendar className="w-6 h-6 text-blue-400" />}
          />
          <StatBox
            label="Memories"
            value={stats.totalMedia}
            icon={<Heart className="w-6 h-6 text-blue-400" />}
          />
          <StatBox
            label="Avg. Happiness"
            value={`${stats.avgMood}%`}
            icon="😊"
          />
        </div>
      )}

      {/* Search & View Controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips by name or destination..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(["grid", "list", "timeline"] as const).map(mode => (
            <Button
              key={mode}
              size="sm"
              variant={viewMode === mode ? "default" : "outline"}
              onClick={() => setViewMode(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Archives View */}
      {filteredArchives.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <ArchiveIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No trip archives found</p>
          <p className="text-gray-500 text-sm mt-1">
            Complete a trip to start building your memory archive
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArchives.map(memory => (
            <div
              key={memory.id}
              onClick={() => handleSelectMemory(memory)}
              className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-600/50 transition cursor-pointer group"
            >
              <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30">
                    {emotionEmoji[memory.emotionalSummary]}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end justify-between p-3">
                  <Badge className="bg-blue-500/80 border-0">
                    {memory.stats.duration} days
                  </Badge>
                  <div className="text-right">
                    <Badge className="bg-green-500/80 border-0 mb-1 block">
                      {memory.stats.totalMedia} media
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{memory.tripName}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {memory.destination}
                  </p>
                </div>

                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(memory.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {(memory.stats.avgDailyMood * 100).toFixed(0)}% mood
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.stopPropagation();
                      handleSelectMemory(memory);
                    }}
                    className="w-full"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArchives.map((memory, idx) => (
            <div
              key={memory.id}
              onClick={() => handleSelectMemory(memory)}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-blue-600/50 transition cursor-pointer flex items-center gap-4"
            >
              <div className="text-4xl">
                {emotionEmoji[memory.emotionalSummary]}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{memory.tripName}</h4>
                <p className="text-sm text-gray-400 flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {memory.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {memory.stats.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {memory.stats.totalMedia} memories
                  </span>
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  {(memory.stats.avgDailyMood * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Memory Details Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">
                  {emotionEmoji[selectedMemory.emotionalSummary]}
                </span>
                {selectedMemory.tripName}
              </h2>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Trip Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailBox
                  icon={MapPin}
                  label="Destination"
                  value={selectedMemory.destination}
                />
                <DetailBox
                  icon={Calendar}
                  label="Duration"
                  value={`${selectedMemory.stats.duration} days`}
                />
                <DetailBox
                  icon={Heart}
                  label="Media Count"
                  value={selectedMemory.stats.totalMedia.toString()}
                />
                <DetailBox
                  icon={Zap}
                  label="Mood"
                  value={`${(selectedMemory.stats.avgDailyMood * 100).toFixed(0)}%`}
                />
              </div>

              {/* Archives Summary */}
              <div>
                <h3 className="font-semibold mb-3">Memory Albums</h3>
                <div className="space-y-2">
                  {selectedMemory.archives.map(archive => (
                    <div
                      key={archive.id}
                      className="bg-gray-800/50 rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{archive.name}</p>
                        <p className="text-sm text-gray-400">
                          {archive.metadata.imageCount} photos
                          {archive.metadata.videoCount > 0 &&
                            ` • ${archive.metadata.videoCount} videos`}
                        </p>
                      </div>
                      <Badge>
                        {(archive.metadata.totalSize / 1000000).toFixed(1)} MB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Trips */}
              {similarTrips.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Similar Past Trips</h3>
                  <div className="space-y-2">
                    {similarTrips.map(trip => (
                      <div
                        key={trip.memoryId}
                        className="bg-gray-800/50 rounded p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{trip.destination}</p>
                          <Badge className="bg-blue-500/30 text-blue-300 border-0">
                            {(trip.score * 100).toFixed(0)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          {trip.sharedActivities.slice(0, 2).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full">
                Browse Rebooking Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl flex justify-center w-6">
          {typeof icon === "string" ? icon : icon}
        </span>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailBox({
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
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
