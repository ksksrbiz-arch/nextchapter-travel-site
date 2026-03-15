import React, { useState } from "react";
import {
  Plus,
  Share2,
  Lock,
  Globe,
  Trash2,
  Edit2,
  Image,
  Zap,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import memoryCuration from "@/_core/services/memoryCuration";
import type {
  MemoryAlbum,
  MemorySummary,
} from "@/_core/services/memoryCuration";

interface MemoryAlbumsProps {
  tripId: string;
}

interface AlbumStats {
  totalPhotos: number;
  totalVideos: number;
  highlightMoments: number;
  averageConfidence: number;
  emotionBreakdown: Record<string, number>;
  capturedLocations: number;
}

export default function MemoryAlbums({ tripId }: MemoryAlbumsProps) {
  const [albums, setAlbums] = React.useState<MemoryAlbum[]>([]);
  const [summary, setSummary] = React.useState<MemorySummary | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<MemoryAlbum | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState<AlbumStats | null>(null);

  // Initialize with mock data
  React.useEffect(() => {
    // Simulate fetching memory summary
    setTimeout(() => {
      const mockSummary = {
        tripId,
        totalMedia: 42,
        highlights: [
          {
            id: "hl-1",
            mediaId: "photo-1",
            emotion: "amazed",
            confidence: 0.94,
            reason:
              "Perfectly captured the golden hour moment with crystal clear composition",
            timestamp: Date.now() - 86400000 * 5,
          },
          {
            id: "hl-2",
            mediaId: "photo-4",
            emotion: "happy",
            confidence: 0.92,
            reason: "Spontaneous family laughter with genuine joy evident",
            timestamp: Date.now() - 86400000 * 2,
          },
        ],
        suggestedAlbums: [
          {
            id: "album-1",
            tripId,
            name: "Adventure Highlights",
            description: "Best moments of exploration and discovery",
            emotion: "adventurous",
            mediaIds: ["photo-1", "video-1", "photo-5"],
            coverImageId: "photo-1",
            createdAt: Date.now(),
            isPublic: false,
          },
          {
            id: "album-2",
            tripId,
            name: "Culinary Journey",
            description: "Food and dining experiences from the trip",
            emotion: "happy",
            mediaIds: ["photo-3", "photo-6", "photo-8"],
            coverImageId: "photo-3",
            createdAt: Date.now(),
            isPublic: false,
          },
          {
            id: "album-3",
            tripId,
            name: "Sunset Moments",
            description: "Golden hour captures from each day",
            emotion: "relaxed",
            mediaIds: ["photo-2", "photo-7"],
            coverImageId: "photo-2",
            createdAt: Date.now(),
            isPublic: false,
          },
        ],
        emotionalJourney: [
          { day: 0, emotion: "excited", intensity: 0.95 },
          { day: 1, emotion: "adventurous", intensity: 0.88 },
          { day: 2, emotion: "happy", intensity: 0.92 },
          { day: 3, emotion: "amazed", intensity: 0.87 },
          { day: 4, emotion: "grateful", intensity: 0.85 },
        ],
        topLocations: [
          { name: "San Francisco", mediaCount: 12 },
          { name: "Big Sur", mediaCount: 8 },
          { name: "Yosemite", mediaCount: 10 },
          { name: "Lake Tahoe", mediaCount: 7 },
        ],
        bestTimes: ["Golden Hour Sunset", "Blue Hour Evening", "Night Magic"],
      };

      setSummary(mockSummary);
      setAlbums(mockSummary.suggestedAlbums);

      setStats({
        totalPhotos: 36,
        totalVideos: 6,
        highlightMoments: mockSummary.highlights.length,
        averageConfidence: 0.9,
        emotionBreakdown: {
          excited: 8,
          adventurous: 10,
          happy: 12,
          amazed: 7,
          grateful: 5,
        },
        capturedLocations: mockSummary.topLocations.length,
      });
    }, 500);
  }, [tripId]);

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim() || !summary) return;

    const newAlbum: MemoryAlbum = {
      id: `custom-${Date.now()}`,
      tripId,
      name: newAlbumName,
      emotion: "curated",
      mediaIds: summary.highlights.slice(0, 3).map(h => h.mediaId),
      coverImageId: summary.highlights[0]?.mediaId || "default",
      createdAt: Date.now(),
      isPublic: false,
    };

    setAlbums([...albums, newAlbum]);
    setNewAlbumName("");
    setShowCreateForm(false);
  };

  const handleShare = (albumId: string) => {
    setAlbums(prev =>
      prev.map(a =>
        a.id === albumId
          ? {
              ...a,
              isPublic: !a.isPublic,
              shares: (a.shares ?? 0) + (a.isPublic ? -1 : 1),
            }
          : a
      )
    );
  };

  const handleDelete = (albumId: string) => {
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum(null);
    }
    setAlbums(prev => prev.filter(a => a.id !== albumId));
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
    curated: "✨",
  } as Record<string, string>;

  return (
    <div className="space-y-8">
      {/* Trip Summary Stats */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-800/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Your Memory Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              label="Photos"
              value={stats.totalPhotos}
              icon={<Image className="w-6 h-6" />}
            />
            <StatCard label="Videos" value={stats.totalVideos} icon="🎬" />
            <StatCard
              label="Highlights"
              value={stats.highlightMoments}
              icon={<Zap className="w-6 h-6" />}
            />
            <StatCard
              label="Locations"
              value={stats.capturedLocations}
              icon={<MapPin className="w-6 h-6" />}
            />
            <StatCard
              label="Avg. Quality"
              value={`${Math.round(stats.averageConfidence * 100)}%`}
              icon="⭐"
            />
            <StatCard
              label="Media Items"
              value={stats.totalPhotos + stats.totalVideos}
              icon="📸"
            />
          </div>
        </div>
      )}

      {/* Emotional Journey Timeline */}
      {summary && summary.emotionalJourney.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Emotional Journey</h3>
          <div className="space-y-3">
            {summary.emotionalJourney.map((day, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 w-12">
                  Day {day.day + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {emotionEmoji[day.emotion] || "😊"}
                    </span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                        style={{ width: `${day.intensity * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {Math.round(day.intensity * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-10 capitalize">
                    Mostly {day.emotion} moments
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Locations */}
      {summary && summary.topLocations.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Most Captured Locations
          </h3>
          <div className="space-y-3">
            {summary.topLocations.map((loc, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="font-medium">{loc.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 w-32 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                      style={{
                        width: `${(loc.mediaCount / Math.max(...summary.topLocations.map(l => l.mediaCount))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">
                    {loc.mediaCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Albums Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Memory Albums</h3>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </div>

        {/* Create Album Form */}
        {showCreateForm && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Album name (e.g., 'Beach Days', 'Mountain Adventure')"
                value={newAlbumName}
                onChange={e => setNewAlbumName(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <Button onClick={handleCreateAlbum} size="sm">
                Create
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No albums yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Create your first album to organize memories
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(album => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-600/50 transition cursor-pointer group"
              >
                {/* Album Cover */}
                <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-30">
                      {emotionEmoji[album.emotion]}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end justify-between p-3">
                    <div>
                      <Badge className="bg-blue-500/80 border-0">
                        {album.mediaIds.length} items
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {album.isPublic ? (
                        <Globe className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {album.name}
                      {album.isPublic && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                          Shared
                        </Badge>
                      )}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {album.description}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={album.isPublic ? "default" : "outline"}
                      onClick={e => {
                        e.stopPropagation();
                        handleShare(album.id);
                      }}
                      className={
                        album.isPublic ? "bg-green-600 border-green-600" : ""
                      }
                    >
                      <Share2 className="w-4 h-4" />
                      {album.shares ? ` ${album.shares}` : ""}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(album.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedAlbum(album);
                      }}
                      className="flex-1"
                    >
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Times Section */}
      {summary && summary.bestTimes.length > 0 && (
        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-6 border border-orange-800/50">
          <h3 className="text-lg font-semibold mb-3">Best Photography Times</h3>
          <div className="flex flex-wrap gap-2">
            {summary.bestTimes.map((time, idx) => (
              <Badge
                key={idx}
                className="bg-orange-500/30 text-orange-300 border-orange-500/50"
              >
                {time}
              </Badge>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            These are the times when you captured the most photos during your
            trip. Perfect for sunset or night shots!
          </p>
        </div>
      )}

      {/* Selected Album Detail Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">
                  {emotionEmoji[selectedAlbum.emotion]}
                </span>
                {selectedAlbum.name}
              </h2>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="p-2 hover:bg-gray-800 rounded transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-300">{selectedAlbum.description}</p>
              <div className="flex gap-2">
                <Badge className="bg-blue-500/30 text-blue-300 border-0">
                  {selectedAlbum.mediaIds.length} items
                </Badge>
                <Badge className="bg-purple-500/30 text-purple-300 border-0 capitalize">
                  {selectedAlbum.emotion}
                </Badge>
                {selectedAlbum.isPublic && (
                  <Badge className="bg-green-500/30 text-green-300 border-0">
                    <Globe className="w-3 h-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button
                  onClick={() => handleShare(selectedAlbum.id)}
                  className={selectedAlbum.isPublic ? "bg-green-600" : ""}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {selectedAlbum.isPublic ? "Shared" : "Share"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedAlbum.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-2 flex justify-center">
        {typeof icon === "string" || typeof icon === "number" ? (
          <span>{icon}</span>
        ) : (
          icon
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
