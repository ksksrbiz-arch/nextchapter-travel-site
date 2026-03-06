import { createContext, useContext, useState, ReactNode } from "react";

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
    src: `${CDN}/landing_c5e5dc41.mp4`,
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=60",
    label: "Explore the World",
  },
  // Dashboard — ocean coastline
  dashboard: {
    src: `${CDN}/dashboard_de8702c9.mp4`,
    poster: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=60",
    label: "Your Journey Awaits",
  },
  // Itinerary — journey / road
  itinerary: {
    src: `${CDN}/itinerary_64381598.mp4`,
    poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=60",
    label: "Day by Day",
  },
  // Documents — airport / travel prep
  documents: {
    src: `${CDN}/documents_289f3a0c.mp4`,
    poster: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
    label: "Travel Documents",
  },
  // Messages — connection / cafe
  messages: {
    src: `${CDN}/messages_d26e6922.mp4`,
    poster: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1280&q=60",
    label: "Stay Connected",
  },
  // Packing — suitcase / travel prep
  packing: {
    src: `${CDN}/packing_f244ae98.mp4`,
    poster: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1280&q=60",
    label: "Pack Your Bags",
  },
  // Bookings — flight / airplane
  bookings: {
    src: `${CDN}/bookings_7a44b4d1.mp4`,
    poster: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
    label: "Your Bookings",
  },
  // Destination guides — tropical / beach
  guides: {
    src: `${CDN}/guides_018e7be3.mp4`,
    poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1280&q=60",
    label: "Discover Your Destination",
  },
  // Alerts — dramatic sky
  alerts: {
    src: `${CDN}/alerts_30bd415e.mp4`,
    poster: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
    label: "Travel Alerts",
  },
};

// ─── Context ────────────────────────────────────────────────────────────────
type VideoHeroContextValue = {
  currentVideo: VideoEntry;
  currentKey: string;
  setVideoContext: (key: string) => void;
  preloadVideo: (key: string) => void;
};

const VideoHeroContext = createContext<VideoHeroContextValue>({
  currentVideo: VIDEO_CATALOG.landing,
  currentKey: 'landing',
  setVideoContext: () => {},
  preloadVideo: () => {},
});

export function VideoHeroProvider({ children }: { children: ReactNode }) {
  const [currentKey, setCurrentKey] = useState<string>('landing');
  const currentVideo = VIDEO_CATALOG[currentKey] ?? VIDEO_CATALOG.landing;

  const setVideoContext = (key: string) => {
    if (VIDEO_CATALOG[key]) {
      setCurrentKey(key);
    }
  };

  const preloadVideo = (key: string) => {
    const entry = VIDEO_CATALOG[key];
    if (!entry) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = entry.src;
    document.head.appendChild(link);
  };

  return (
    <VideoHeroContext.Provider value={{ currentVideo, currentKey, setVideoContext, preloadVideo }}>
      {children}
    </VideoHeroContext.Provider>
  );
}

export function useVideoHero() {
  return useContext(VideoHeroContext);
}
