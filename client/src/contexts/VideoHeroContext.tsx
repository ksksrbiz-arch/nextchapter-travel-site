import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
export type VideoEntry = {
  src: string;
  poster: string;
  label: string;
};

// ─── CDN base ────────────────────────────────────────────────────────────────
const CDN =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663400814556/YzQ4CdxemtnRpcg9zzL4Fa";

// ─── Expanded Video Catalog ───────────────────────────────────────────────────
// 4-5 diverse videos per context. On each navigation the context randomly
// picks one, so every visit feels different.
// Source: Mixkit free stock video (mixkit.co) — commercial use permitted.
export const VIDEO_CATALOG: Record<string, VideoEntry[]> = {
  // ── Landing page ─────────────────────────────────────────────────────────
  landing: [
    {
      src: `${CDN}/landing_aerial_coast_2923b6d3.mp4`,
      poster:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=60",
      label: "Explore the World",
    },
    {
      src: `${CDN}/landing_aerial_city_332d83e3.mp4`,
      poster:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&q=60",
      label: "Explore the World",
    },
    {
      src: `${CDN}/landing_aerial_mountains_cce6e700.mp4`,
      poster:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&q=60",
      label: "Explore the World",
    },
    {
      src: `${CDN}/landing_hot_air_balloon_9ad6a19b.mp4`,
      poster:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=60",
      label: "Explore the World",
    },
    {
      src: `${CDN}/landing_open_road_7816ecc1.mp4`,
      poster:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=60",
      label: "Explore the World",
    },
  ],

  // ── Dashboard ────────────────────────────────────────────────────────────
  dashboard: [
    {
      src: `${CDN}/dashboard_beach_waves_ef297baf.mp4`,
      poster:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1280&q=60",
      label: "Your Journey Awaits",
    },
    {
      src: `${CDN}/dashboard_resort_pool_b9a2cb58.mp4`,
      poster:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1280&q=60",
      label: "Your Journey Awaits",
    },
    {
      src: `${CDN}/dashboard_tropical_lagoon_9d8e5706.mp4`,
      poster:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1280&q=60",
      label: "Your Journey Awaits",
    },
    {
      src: `${CDN}/dashboard_ocean_sunset_be67eb15.mp4`,
      poster:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1280&q=60",
      label: "Your Journey Awaits",
    },
    {
      src: `${CDN}/dashboard_palm_beach_814c8f8f.mp4`,
      poster:
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1280&q=60",
      label: "Your Journey Awaits",
    },
  ],

  // ── Itinerary ────────────────────────────────────────────────────────────
  itinerary: [
    {
      src: `${CDN}/itinerary_7348dd96.mp4`,
      poster:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&q=60",
      label: "Day by Day",
    },
    {
      src: `${CDN}/itinerary_winding_road_f5ec4e85.mp4`,
      poster:
        "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=1280&q=60",
      label: "Day by Day",
    },
    {
      src: `${CDN}/itinerary_city_walking_8f5b096c.mp4`,
      poster:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&q=60",
      label: "Day by Day",
    },
    {
      src: `${CDN}/itinerary_map_planning_d78a3c0d.mp4`,
      poster:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1280&q=60",
      label: "Day by Day",
    },
    {
      src: `${CDN}/itinerary_bridge_crossing_14e8ab6c.mp4`,
      poster:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1280&q=60",
      label: "Day by Day",
    },
  ],

  // ── Documents ────────────────────────────────────────────────────────────
  documents: [
    {
      src: `${CDN}/documents_1a88f454.mp4`,
      poster:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
      label: "Travel Documents",
    },
    {
      src: `${CDN}/documents_airport_terminal_6eb26264.mp4`,
      poster:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1280&q=60",
      label: "Travel Documents",
    },
    {
      src: `${CDN}/documents_boarding_gate_d6fdd8a7.mp4`,
      poster:
        "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1280&q=60",
      label: "Travel Documents",
    },
    {
      src: `${CDN}/documents_luggage_carousel_7888a232.mp4`,
      poster:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1280&q=60",
      label: "Travel Documents",
    },
    {
      src: `${CDN}/documents_passport_check_4c5b3135.mp4`,
      poster:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1280&q=60",
      label: "Travel Documents",
    },
    {
      src: `${CDN}/documents_plane_takeoff_fb3b5bc5.mp4`,
      poster:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
      label: "Travel Documents",
    },
  ],

  // ── Messages ─────────────────────────────────────────────────────────────
  messages: [
    {
      src: `${CDN}/messages_5d50481a.mp4`,
      poster:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1280&q=60",
      label: "Stay Connected",
    },
    {
      src: `${CDN}/messages_cafe_paris_81954119.mp4`,
      poster:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1280&q=60",
      label: "Stay Connected",
    },
    {
      src: `${CDN}/messages_couple_travel_8f1c13ee.mp4`,
      poster:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1280&q=60",
      label: "Stay Connected",
    },
    {
      src: `${CDN}/messages_phone_travel_7eeb20d1.mp4`,
      poster:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1280&q=60",
      label: "Stay Connected",
    },
    {
      src: `${CDN}/messages_sunset_couple_2304e8e2.mp4`,
      poster:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
      label: "Stay Connected",
    },
    {
      src: `${CDN}/messages_waterfront_chat_442dcc4c.mp4`,
      poster:
        "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1280&q=60",
      label: "Stay Connected",
    },
  ],

  // ── Packing ──────────────────────────────────────────────────────────────
  packing: [
    {
      src: `${CDN}/packing_aee5f9f2.mp4`,
      poster:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1280&q=60",
      label: "Pack Your Bags",
    },
    {
      src: `${CDN}/packing_suitcase_open_b82d51ac.mp4`,
      poster:
        "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1280&q=60",
      label: "Pack Your Bags",
    },
    {
      src: `${CDN}/packing_clothes_folding_23280ae3.mp4`,
      poster:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1280&q=60",
      label: "Pack Your Bags",
    },
    {
      src: `${CDN}/packing_travel_gear_9049ef48.mp4`,
      poster:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1280&q=60",
      label: "Pack Your Bags",
    },
    {
      src: `${CDN}/packing_backpack_dfa53868.mp4`,
      poster:
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1280&q=60",
      label: "Pack Your Bags",
    },
    {
      src: `${CDN}/packing_shoes_travel_54e03f1a.mp4`,
      poster:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1280&q=60",
      label: "Pack Your Bags",
    },
  ],

  // ── Bookings ─────────────────────────────────────────────────────────────
  bookings: [
    {
      src: `${CDN}/bookings_2a93f868.mp4`,
      poster:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
      label: "Your Bookings",
    },
    {
      src: `${CDN}/bookings_plane_window_7e6001a8.mp4`,
      poster:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1280&q=60",
      label: "Your Bookings",
    },
    {
      src: `${CDN}/bookings_flight_landing_e65ea703.mp4`,
      poster:
        "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1280&q=60",
      label: "Your Bookings",
    },
    {
      src: `${CDN}/bookings_airport_runway_78be1930.mp4`,
      poster:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1280&q=60",
      label: "Your Bookings",
    },
    {
      src: `${CDN}/bookings_first_class_b67e591f.mp4`,
      poster:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1280&q=60",
      label: "Your Bookings",
    },
    {
      src: `${CDN}/bookings_travel_map_628c9638.mp4`,
      poster:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1280&q=60",
      label: "Your Bookings",
    },
  ],

  // ── Destination Guides ───────────────────────────────────────────────────
  guides: [
    {
      src: `${CDN}/guides_103d6835.mp4`,
      poster:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1280&q=60",
      label: "Discover Your Destination",
    },
    {
      src: `${CDN}/guides_european_city_17e39e3d.mp4`,
      poster:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1280&q=60",
      label: "Discover Your Destination",
    },
    {
      src: `${CDN}/guides_temple_asia_0659f1cd.mp4`,
      poster:
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1280&q=60",
      label: "Discover Your Destination",
    },
    {
      src: `${CDN}/guides_mountains_hike_b80ea661.mp4`,
      poster:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&q=60",
      label: "Discover Your Destination",
    },
    {
      src: `${CDN}/guides_market_local_9b0d4eb6.mp4`,
      poster:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1280&q=60",
      label: "Discover Your Destination",
    },
    {
      src: `${CDN}/guides_tropical_beach_6837644b.mp4`,
      poster:
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1280&q=60",
      label: "Discover Your Destination",
    },
  ],

  // ── Alerts ───────────────────────────────────────────────────────────────
  alerts: [
    {
      src: `${CDN}/alerts_bcd3edf2.mp4`,
      poster:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
      label: "Travel Alerts",
    },
    {
      src: `${CDN}/alerts_storm_clouds_7accfca7.mp4`,
      poster:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
      label: "Travel Alerts",
    },
    {
      src: `${CDN}/alerts_dramatic_sunset_c229c680.mp4`,
      poster:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1280&q=60",
      label: "Travel Alerts",
    },
    {
      src: `${CDN}/alerts_lightning_3b577d04.mp4`,
      poster:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
      label: "Travel Alerts",
    },
    {
      src: `${CDN}/alerts_foggy_morning_611fb487.mp4`,
      poster:
        "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1280&q=60",
      label: "Travel Alerts",
    },
    {
      src: `${CDN}/alerts_rain_window_276b9119.mp4`,
      poster:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1280&q=60",
      label: "Travel Alerts",
    },
  ],
};

// ─── Helper: pick a random entry from an array ───────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Context ─────────────────────────────────────────────────────────────────
type VideoHeroContextValue = {
  currentVideo: VideoEntry;
  currentKey: string;
  setVideoContext: (key: string) => void;
  preloadContext: (key: string) => void;
};

const VideoHeroContext = createContext<VideoHeroContextValue>({
  currentVideo: pickRandom(VIDEO_CATALOG.landing),
  currentKey: "landing",
  setVideoContext: () => {},
  preloadContext: () => {},
});

export function VideoHeroProvider({ children }: { children: ReactNode }) {
  const [currentKey, setCurrentKey] = useState<string>("landing");
  const [currentVideo, setCurrentVideo] = useState<VideoEntry>(() =>
    pickRandom(VIDEO_CATALOG.landing)
  );

  const setVideoContext = useCallback((key: string) => {
    const pool = VIDEO_CATALOG[key];
    if (!pool) return;
    setCurrentKey(key);
    setCurrentVideo(pickRandom(pool));
  }, []);

  // Preload a context's first video so it's ready before navigation
  const preloadContext = useCallback((key: string) => {
    const pool = VIDEO_CATALOG[key];
    if (!pool || pool.length === 0) return;
    const entry = pool[0];
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = entry.src;
    document.head.appendChild(link);
  }, []);

  return (
    <VideoHeroContext.Provider
      value={{ currentVideo, currentKey, setVideoContext, preloadContext }}
    >
      {children}
    </VideoHeroContext.Provider>
  );
}

export function useVideoHero() {
  return useContext(VideoHeroContext);
}
