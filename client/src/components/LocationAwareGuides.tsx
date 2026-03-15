import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Compass, Star, AlertCircle } from "lucide-react";
import {
  getRealtimeSyncService,
  LocationUpdate,
} from "../_core/services/realtimeSync";

interface LocationGuide {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: "restaurant" | "attraction" | "activity" | "shop" | "emergency";
  rating?: number;
  distance: number;
  description: string;
  openNow?: boolean;
  price?: string;
  icon: React.ReactNode;
}

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
}

// Mock location guides data - in production, would come from backend
const MOCK_GUIDES: LocationGuide[] = [
  {
    id: "1",
    name: "Café Central",
    latitude: 40.7128,
    longitude: -74.006,
    category: "restaurant",
    rating: 4.8,
    distance: 0.3,
    description: "Cozy café with excellent espresso",
    openNow: true,
    price: "$$",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: "2",
    name: "Museum of Modern Art",
    latitude: 40.7614,
    longitude: -73.9776,
    category: "attraction",
    rating: 4.7,
    distance: 1.2,
    description: "World-class art collection",
    openNow: true,
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: "3",
    name: "Central Park",
    latitude: 40.7829,
    longitude: -73.9654,
    category: "activity",
    rating: 4.9,
    distance: 2.1,
    description: "Urban park with trails and activities",
    openNow: true,
    icon: <Navigation className="w-4 h-4" />,
  },
  {
    id: "4",
    name: "Emergency Hospital",
    latitude: 40.7505,
    longitude: -73.9972,
    category: "emergency",
    distance: 0.8,
    description: "24/7 Emergency Services",
    icon: <AlertCircle className="w-4 h-4" />,
  },
];

const LocationAwareGuides: React.FC<{ tripId: string }> = ({ tripId }) => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [nearbyGuides, setNearbyGuides] = useState<LocationGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<LocationGuide | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const geolocationWatchId = useRef<number | null>(null);
  const realtimeSync = useRef(getRealtimeSyncService());

  // Start location tracking
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Request initial location
    navigator.geolocation.getCurrentPosition(
      position => {
        const loc: LocationState = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading || undefined,
        };
        setLocation(loc);
        updateNearbyGuides(loc);
        setLoading(false);

        // Start watching position for continuous updates
        geolocationWatchId.current = navigator.geolocation.watchPosition(
          newPosition => {
            const newLoc: LocationState = {
              latitude: newPosition.coords.latitude,
              longitude: newPosition.coords.longitude,
              accuracy: newPosition.coords.accuracy,
              heading: newPosition.coords.heading || undefined,
            };
            setLocation(newLoc);
            updateNearbyGuides(newLoc);

            // Send to WebSocket for real-time sync
            realtimeSync.current.sendLocationUpdate({
              userId: "current-user", // In production, get from context
              latitude: newLoc.latitude,
              longitude: newLoc.longitude,
              accuracy: newLoc.accuracy,
              timestamp: Date.now(),
            });
          },
          err => {
            console.error("Geolocation error:", err);
            setError("Unable to get your location");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000, // Update every 5 seconds
          }
        );
      },
      err => {
        console.error("Geolocation error:", err);
        setError(
          "Unable to access your location. Please enable location services."
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (geolocationWatchId.current !== null) {
        navigator.geolocation.clearWatch(geolocationWatchId.current);
      }
    };
  }, [tripId]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateNearbyGuides = (loc: LocationState): void => {
    let guides = MOCK_GUIDES.map(guide => ({
      ...guide,
      distance: calculateDistance(
        loc.latitude,
        loc.longitude,
        guide.latitude,
        guide.longitude
      ),
    }))
      .filter(guide => guide.distance < 5) // Within 5 km
      .filter(guide => !filterCategory || guide.category === filterCategory);

    if (sortBy === "distance") {
      guides.sort((a, b) => a.distance - b.distance);
    } else {
      guides.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setNearbyGuides(guides);
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "restaurant":
        return "bg-amber-100 text-amber-800";
      case "attraction":
        return "bg-purple-100 text-purple-800";
      case "activity":
        return "bg-blue-100 text-blue-800";
      case "shop":
        return "bg-pink-100 text-pink-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Location & Guides</h2>
          </div>
          {location && (
            <div className="text-sm opacity-90">
              {location.accuracy.toFixed(0)}m accuracy
            </div>
          )}
        </div>

        {location && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="opacity-75">Latitude</div>
              <div className="font-mono">{location.latitude.toFixed(4)}°</div>
            </div>
            <div>
              <div className="opacity-75">Longitude</div>
              <div className="font-mono">{location.longitude.toFixed(4)}°</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-300 rounded p-3 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-4 text-sm opacity-75">
            Getting your location...
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            filterCategory === null
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
        {["restaurant", "attraction", "activity", "emergency"].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm transition capitalize ${
              filterCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as "distance" | "rating")}
          className="px-3 py-2 rounded border border-gray-300 text-sm"
        >
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Nearby Guides List */}
      <div className="space-y-3">
        {nearbyGuides.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Compass className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No guides found in your area</p>
          </div>
        ) : (
          nearbyGuides.map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${getCategoryColor(guide.category)}`}
                  >
                    {guide.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {guide.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {guide.description}
                    </p>
                    {guide.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {guide.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    {guide.distance.toFixed(1)} km
                  </div>
                  {guide.price && (
                    <div className="text-sm text-gray-600">{guide.price}</div>
                  )}
                </div>
              </div>

              {guide.openNow !== undefined && (
                <div
                  className={`text-xs font-medium ${
                    guide.openNow ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {guide.openNow ? "✓ Open now" : "Closed"}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Selected Guide Details */}
      {selectedGuide && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-blue-200 rounded-lg p-6 fixed inset-0 md:static md:inset-auto z-50 md:z-auto flex flex-col md:block">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedGuide.name}
            </h3>
            <button
              onClick={() => setSelectedGuide(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl md:hidden"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-700 mb-4">{selectedGuide.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-lg font-semibold">
                {selectedGuide.distance.toFixed(1)} km
              </div>
            </div>
            {selectedGuide.rating && (
              <div>
                <div className="text-sm text-gray-600">Rating</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {selectedGuide.rating}
                </div>
              </div>
            )}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition md:w-auto">
            Navigate to Location
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationAwareGuides;
