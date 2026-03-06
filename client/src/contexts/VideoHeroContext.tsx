import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Video catalog — CDN-hosted MP4s (CloudFront, iOS Safari compatible) ──────
// All videos are self-hosted on our CDN to ensure iOS Safari autoplay works.
// Videos are muted, looping, and under 5MB each for fast mobile loading.
export type VideoEntry = {
  src: string;
  poster: string;
  label: string;
};

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663400814556/YzQ4CdxemtnRpcg9zzL4Fa";

export const VIDEO_CATALOG: Record<string, VideoEntry> = {
  // Landing page — cinematic travel aerial
  landing: {
    src: `${CDN}/landing_8f855cd9.mp4`,
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=60",
    label: "Explore the World",
  },
  // Dashboard — ocean coastline
  dashboard: {
    src: `${CDN}/dashboard_7ec357e0.mp4`,
    poster: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=60",
    label: "Your Journey Awaits",
  },
  // Itinerary — journey / road
  itinerary: {
    src: `${CDN}/itinerary_61142b31.mp4`,
    poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=60",
    label: "Day by Day",
  },
  // Documents — airport / travel prep
  documents: {
    src: `${CDN}/documents_94ff49db.mp4`,
    poster: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
    label: "Travel Documents",
  },
  // Messages — connection / cafe
  messages: {
    src: `${CDN}/messages_25dae929.mp4`,
    poster: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1280&q=60",
    label: "Stay Connected",
  },
  // Packing — suitcase / travel prep
  packing: {
    src: `${CDN}/packing_6982a0d7.mp4`,
    poster: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1280&q=60",
    label: "Pack Your Bags",
  },
  // Bookings — flight / airplane
  bookings: {
    src: `${CDN}/bookings_b2b35912.mp4`,
    poster: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
    label: "Your Bookings",
  },
  // Destination guides — tropical / beach
  guides: {
    src: `${CDN}/guides_13946e1c.mp4`,
    poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1280&q=60",
    label: "Discover Your Destination",
  },
  // Alerts — dramatic sky
  alerts: {
    src: `${CDN}/alerts_8bd7bff5.mp4`,
    poster: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
    label: "Travel Alerts",
  },
  // Disney / theme park context — reuse landing
  disney: {
    src: `${CDN}/landing_8f855cd9.mp4`,
    poster: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=1280&q=60",
    label: "The Magic Awaits",
  },
  // Cruise context — reuse dashboard ocean
  cruise: {
    src: `${CDN}/dashboard_7ec357e0.mp4`,
    poster: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1280&q=60",
    label: "Set Sail",
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

type VideoHeroState = {
  currentKey: string;
  currentVideo: VideoEntry;
  setVideoContext: (key: string) => void;
  isTransitioning: boolean;
};

const VideoHeroContext = createContext<VideoHeroState>({
  currentKey: "landing",
  currentVideo: VIDEO_CATALOG.landing,
  setVideoContext: () => {},
  isTransitioning: false,
});

export function VideoHeroProvider({ children }: { children: ReactNode }) {
  const [currentKey, setCurrentKey] = useState("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setVideoContext = useCallback((key: string) => {
    const videoKey = VIDEO_CATALOG[key] ? key : "landing";
    if (videoKey === currentKey) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentKey(videoKey);
      setIsTransitioning(false);
    }, 150);
  }, [currentKey]);

  const currentVideo = VIDEO_CATALOG[currentKey] ?? VIDEO_CATALOG.landing;

  return (
    <VideoHeroContext.Provider value={{ currentKey, currentVideo, setVideoContext, isTransitioning }}>
      {children}
    </VideoHeroContext.Provider>
  );
}

export function useVideoHero() {
  return useContext(VideoHeroContext);
}
