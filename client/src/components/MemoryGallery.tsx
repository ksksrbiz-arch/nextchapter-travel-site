import React, { useState } from "react";
import {
  Image,
  Video,
  Heart,
  Share2,
  Trash2,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  MapPin,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import memoryCuration from "@/_core/services/memoryCuration";
import type {
  TripMedia,
  HighlightMoment,
} from "@/_core/services/memoryCuration";

interface MemoryGalleryProps {
  tripId: string;
}

export default function MemoryGallery({ tripId }: MemoryGalleryProps) {
  const [photos, setPhotos] = React.useState<TripMedia[]>([]);
  const [highlights, setHighlights] = React.useState<HighlightMoment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filteredView, setFilteredView] = useState<"all" | "highlights">("all");
  const [viewMode, setViewMode] = useState<"grid" | "slideshow">("grid");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Initialize with mock data
  React.useEffect(() => {
    const mockMedia: Array<Omit<TripMedia, "emotion" | "confidence">> = [
      {
        id: "photo-1",
        type: "photo",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600",
        timestamp: Date.now() - 86400000 * 5,
        caption: "Sunrise at mountain peak",
        location: { name: "Rocky Mountains", lat: 39.7392, lng: -104.9903 },
        metadata: { brightness: 0.95, blur: false, people: 1 },
      },
      {
        id: "photo-2",
        type: "photo",
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600",
        timestamp: Date.now() - 86400000 * 4,
        caption: "Sunset over the ocean",
        location: { name: "California Coast", lat: 36.6002, lng: -121.8863 },
        metadata: { brightness: 0.88, blur: false, people: 0 },
      },
      {
        id: "photo-3",
        type: "photo",
        url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600",
        timestamp: Date.now() - 86400000 * 3,
        caption: "Delicious local cuisine",
        location: { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
        metadata: { brightness: 0.72, blur: false, people: 0 },
      },
      {
        id: "photo-4",
        type: "photo",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600",
        timestamp: Date.now() - 86400000 * 2,
        caption: "Family laughter",
        location: { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
        metadata: { brightness: 0.85, blur: false, people: 3 },
      },
      {
        id: "photo-5",
        type: "photo",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600",
        timestamp: Date.now() - 86400000 * 1,
        caption: "Beach relaxation",
        location: { name: "Big Sur", lat: 36.2704, lng: -121.805 },
        metadata: { brightness: 0.9, blur: false, people: 1 },
      },
      {
        id: "video-1",
        type: "video",
        url: "https://videos.unsplash.com/video-static/converted/a_bunch_of_nature_video_in_beautiful_4k.mp4",
        timestamp: Date.now() - 86400000 * 3,
        caption: "Nature exploration",
        location: { name: "Yosemite", lat: 37.8651, lng: -119.5383 },
        metadata: { duration: 45, brightness: 0.8, blur: false, people: 0 },
      },
    ];

    // Process all media
    Promise.all(mockMedia.map(m => memoryCuration.processMedia(m))).then(
      processed => {
        setPhotos(processed);
        setHighlights(memoryCuration.detectHighlights(tripId));
      }
    );
  }, [tripId]);

  const displayMedia =
    filteredView === "highlights"
      ? photos.filter(p => highlights.some(h => h.mediaId === p.id))
      : photos;

  const handlePrevious = () => {
    setSelectedIndex(prev =>
      prev === null
        ? displayMedia.length - 1
        : prev === 0
          ? displayMedia.length - 1
          : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(prev =>
      prev === null ? 0 : prev === displayMedia.length - 1 ? 0 : prev + 1
    );
  };

  const toggleLike = (mediaId: string) => {
    setLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mediaId)) {
        newSet.delete(mediaId);
      } else {
        newSet.add(mediaId);
      }
      return newSet;
    });
  };

  const handleDelete = (mediaId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== mediaId));
    if (selectedIndex !== null) setSelectedIndex(null);
  };

  const selectedPhoto =
    selectedIndex !== null ? displayMedia[selectedIndex] : null;
  const highlightInfo = selectedPhoto
    ? highlights.find(h => h.mediaId === selectedPhoto.id)
    : null;

  return (
    <div className="space-y-6">
      {/* Slideshow Mode */}
      {viewMode === "slideshow" && selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setViewMode("grid")}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto">
            {selectedPhoto.type === "photo" ? (
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-w-4xl max-h-[70vh] rounded-lg object-contain"
              />
            ) : (
              <video
                src={selectedPhoto.url}
                controls
                className="max-w-4xl max-h-[70vh] rounded-lg"
              />
            )}

            <div className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {selectedPhoto.caption}
                  </p>
                  {selectedPhoto.location && (
                    <p className="text-gray-300 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {selectedPhoto.location.name}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedPhoto.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {highlightInfo && (
                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
                    <Zap className="w-3 h-3 mr-1" />
                    Highlight
                  </Badge>
                )}
              </div>

              {highlightInfo && (
                <p className="text-gray-200 text-sm mb-3 italic">
                  "{highlightInfo.reason}"
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={liked.has(selectedPhoto.id) ? "default" : "outline"}
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className={
                    liked.has(selectedPhoto.id)
                      ? "bg-red-500 border-red-500"
                      : ""
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${
                      liked.has(selectedPhoto.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(selectedPhoto.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-white text-sm">
              {selectedIndex! + 1} / {displayMedia.length}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Memory Gallery</h2>
          <p className="text-gray-400 text-sm mt-1">
            {displayMedia.length} moments captured •{" "}
            {photos.filter(p => p.type === "video").length} videos
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filteredView === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredView("all")}
          >
            All Photos ({photos.length})
          </Button>
          <Button
            variant={filteredView === "highlights" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilteredView("highlights")}
          >
            <Zap className="w-4 h-4 mr-1" />
            Highlights ({highlights.length})
          </Button>
          <Button
            variant={viewMode === "slideshow" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("slideshow")}
          >
            Slideshow
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {displayMedia.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <Image className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            No {filteredView === "highlights" ? "highlight" : ""} photos yet
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Upload or select memories to create albums
          </p>
        </div>
      ) : (
        <>
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayMedia.map((photo, idx) => {
              const isHighlight = highlights.some(h => h.mediaId === photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setViewMode("slideshow");
                  }}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                >
                  {photo.type === "photo" ? (
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-800 flex items-center justify-center group-hover:scale-110 transition duration-300">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <Video className="w-8 h-8 text-white absolute" />
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-2">
                    {isHighlight && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500/80 text-yellow-950 border-0">
                          <Zap className="w-3 h-3" />
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Caption on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 translate-y-full group-hover:translate-y-0 transition">
                    <p className="text-white text-sm font-medium">
                      {photo.caption}
                    </p>
                    {photo.location && (
                      <p className="text-gray-300 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location.name}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emotion Breakdown */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="font-semibold mb-3">Emotional Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from(new Set(photos.map(p => p.emotion))).map(emotion => {
                const count = photos.filter(p => p.emotion === emotion).length;
                const percentage = Math.round((count / photos.length) * 100);
                return (
                  <div key={emotion} className="text-center">
                    <div className="text-3xl mb-1">
                      {emotion === "happy" && "😊"}
                      {emotion === "excited" && "🤩"}
                      {emotion === "surprised" && "😲"}
                      {emotion === "relaxed" && "😌"}
                      {emotion === "adventurous" && "🚀"}
                      {emotion === "tender" && "💕"}
                      {emotion === "grateful" && "🙏"}
                      {emotion === "amazed" && "🤯"}
                    </div>
                    <p className="text-sm font-medium capitalize">{emotion}</p>
                    <p className="text-xs text-gray-400">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
