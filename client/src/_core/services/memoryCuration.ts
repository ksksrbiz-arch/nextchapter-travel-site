/**
 * Sentiment-Based Memory Curation Service
 * Analyzes trip photos/videos to identify and curate highlight moments
 * Uses visual confidence scoring and temporal analysis for album creation
 * Simulates computer vision for emotion detection in real-world context
 */

export interface TripMedia {
  id: string;
  type: "photo" | "video";
  url: string;
  timestamp: number; // Unix timestamp when captured
  caption?: string;
  emotion?: string; // happy, excited, surprised, relaxed, adventurous, tender, etc.
  confidence: number; // 0-1 confidence score
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };
  metadata?: {
    duration?: number; // for videos, in seconds
    brightness?: number; // 0-1
    blur?: boolean; // detected blur
    people?: number; // estimated count
  };
}

export interface MemoryAlbum {
  id: string;
  tripId: string;
  name: string;
  description?: string;
  coverImageId?: string;
  mediaIds: string[];
  emotion: string; // theme: adventure, relaxation, family, romance, etc.
  createdAt: number;
  isPublic: boolean;
  shares?: number;
}

export interface HighlightMoment {
  id: string;
  mediaId: string;
  emotion: string;
  confidence: number;
  reason: string; // why it's highlighted
  timestamp: number;
}

export interface MemorySummary {
  tripId: string;
  totalMedia: number;
  highlights: HighlightMoment[];
  suggestedAlbums: MemoryAlbum[];
  emotionalJourney: Array<{ day: number; emotion: string; intensity: number }>;
  topLocations: Array<{ name: string; mediaCount: number }>;
  bestTimes: string[]; // golden hour, sunset, blue hour, etc.
}

const EMOTIONS = [
  "happy",
  "excited",
  "surprised",
  "relaxed",
  "adventurous",
  "tender",
  "grateful",
  "amazed",
];
const ALBUM_THEMES = [
  "Adventure Highlights",
  "Foodie Journey",
  "Sunset Moments",
  "Family Fun",
  "Solo Exploration",
  "Relaxation Reads",
  "Cultural Immersion",
  "Night Life",
];

class MemoryCurationService {
  private mediaCache: Map<string, TripMedia[]> = new Map();
  private albumsCache: Map<string, MemoryAlbum[]> = new Map();
  private highlightsCache: Map<string, HighlightMoment[]> = new Map();

  /**
   * Process trip media and auto-detect emotional content
   * Simulates computer vision with confidence scoring
   */
  async processMedia(
    media: Omit<TripMedia, "emotion" | "confidence">
  ): Promise<TripMedia> {
    // Simulate processing delay (500-1500ms)
    await new Promise(resolve =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    // Simulate emotion detection based on media characteristics
    const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    const confidence = 0.75 + Math.random() * 0.2; // 75-95%

    return {
      ...media,
      emotion,
      confidence,
    };
  }

  /**
   * Add media to trip gallery
   */
  async addMedia(
    tripId: string,
    media: Omit<TripMedia, "emotion" | "confidence">
  ): Promise<TripMedia> {
    const processedMedia = await this.processMedia(media);

    if (!this.mediaCache.has(tripId)) {
      this.mediaCache.set(tripId, []);
    }
    this.mediaCache.get(tripId)!.push(processedMedia);

    // Invalidate caches
    this.highlightsCache.delete(tripId);
    this.albumsCache.delete(tripId);

    return processedMedia;
  }

  /**
   * Get all trip media
   */
  getMedia(tripId: string): TripMedia[] {
    return this.mediaCache.get(tripId) || [];
  }

  /**
   * Detect highlight moments based on emotion and confidence
   * Returns top emotional peaks from the trip
   */
  detectHighlights(tripId: string): HighlightMoment[] {
    if (this.highlightsCache.has(tripId)) {
      return this.highlightsCache.get(tripId)!;
    }

    const media = this.getMedia(tripId);
    if (media.length === 0) return [];

    // Score media based on emotion confidence and uniqueness
    const scored = media.map((m, idx) => ({
      media: m,
      score: m.confidence * (0.8 + Math.random() * 0.2), // Confidence + uniqueness
      isUnique:
        idx === 0 ||
        media.slice(0, idx).every(prev => prev.emotion !== m.emotion),
    }));

    // Select top 20% as highlights, but ensure emotion variety
    const highlights = scored
      .filter(s => s.isUnique || s.score > 0.85)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(3, Math.ceil(media.length * 0.2)))
      .map(
        s =>
          ({
            id: `hl-${s.media.id}`,
            mediaId: s.media.id,
            emotion: s.media.emotion || "memorable",
            confidence: s.media.confidence,
            reason: this.generateHighlightReason(s.media),
            timestamp: s.media.timestamp,
          }) as HighlightMoment
      );

    this.highlightsCache.set(tripId, highlights);
    return highlights;
  }

  /**
   * Auto-generate memory albums based on emotion patterns
   */
  generateAlbums(tripId: string): MemoryAlbum[] {
    if (this.albumsCache.has(tripId)) {
      return this.albumsCache.get(tripId)!;
    }

    const media = this.getMedia(tripId);
    if (media.length < 3) return [];

    const albums: MemoryAlbum[] = [];

    // Group by dominant emotions
    const emotionGroups = new Map<string, TripMedia[]>();
    media.forEach(m => {
      const key = m.emotion || "other";
      if (!emotionGroups.has(key)) {
        emotionGroups.set(key, []);
      }
      emotionGroups.get(key)!.push(m);
    });

    // Create albums for emotions with 3+ media items
    emotionGroups.forEach((items, emotion) => {
      if (items.length >= 3) {
        const theme =
          ALBUM_THEMES[EMOTIONS.indexOf(emotion) % ALBUM_THEMES.length];

        albums.push({
          id: `album-${emotion}-${tripId}`,
          tripId,
          name: theme,
          description: `Curated memories capturing ${emotion} moments from your trip`,
          emotion,
          mediaIds: items.map(i => i.id),
          coverImageId: items[0].id,
          createdAt: Date.now(),
          isPublic: false,
          shares: 0,
        });
      }
    });

    // Create comprehensive "Full Trip" album if enough media
    if (media.length >= 5) {
      albums.unshift({
        id: `album-full-${tripId}`,
        tripId,
        name: "Complete Journey",
        description: "All moments from your journey",
        emotion: "grateful",
        mediaIds: media
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(m => m.id),
        coverImageId: media[0].id,
        createdAt: Date.now(),
        isPublic: false,
        shares: 0,
      });
    }

    this.albumsCache.set(tripId, albums);
    return albums;
  }

  /**
   * Get summarized memory insights for trip
   */
  getMemorySummary(tripId: string): MemorySummary {
    const media = this.getMedia(tripId);
    const highlights = this.detectHighlights(tripId);

    // Calculate emotional journey by day
    const dailyEmotions = new Map<number, Map<string, number>>();
    media.forEach(m => {
      const day = Math.floor(
        (m.timestamp - media[0].timestamp) / (24 * 60 * 60 * 1000)
      );
      if (!dailyEmotions.has(day)) {
        dailyEmotions.set(day, new Map());
      }
      const dayMap = dailyEmotions.get(day)!;
      dayMap.set(
        m.emotion || "other",
        (dayMap.get(m.emotion || "other") ?? 0) + 1
      );
    });

    const emotionalJourney = Array.from(dailyEmotions.entries()).map(
      ([day, emotions]) => {
        const entries = Array.from(emotions.entries());
        const topEmotion = entries.sort((a, b) => b[1] - a[1])[0];
        return {
          day,
          emotion: topEmotion[0],
          intensity: Math.min(1, topEmotion[1] / 10),
        };
      }
    );

    // Group media by location
    const locationsMap = new Map<string, number>();
    media.forEach(m => {
      if (m.location) {
        const count = locationsMap.get(m.location.name) ?? 0;
        locationsMap.set(m.location.name, count + 1);
      }
    });
    const topLocations = Array.from(locationsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, mediaCount: count }));

    // Detect best times (golden hour, sunset, etc.)
    const bestTimes = this.detectBestTimes(media);

    return {
      tripId,
      totalMedia: media.length,
      highlights,
      suggestedAlbums: this.generateAlbums(tripId),
      emotionalJourney,
      topLocations,
      bestTimes,
    };
  }

  /**
   * Analyze media timestamps for special times
   */
  private detectBestTimes(media: TripMedia[]): string[] {
    const times: string[] = [];
    const hours = new Map<number, number>();

    media.forEach(m => {
      const hour = new Date(m.timestamp).getHours();
      hours.set(hour, (hours.get(hour) ?? 0) + 1);
    });

    const sorted = Array.from(hours.entries()).sort((a, b) => b[1] - a[1]);

    // Identify special times
    sorted.forEach(([hour, count]) => {
      if (hour >= 5 && hour <= 7 && count > 0) times.push("Early Sunrise");
      if (hour >= 17 && hour <= 19 && count > 0)
        times.push("Golden Hour Sunset");
      if (hour >= 20 && hour <= 22 && count > 0)
        times.push("Blue Hour Evening");
      if (hour >= 22 || hour <= 3) times.push("Night Magic");
    });

    return [...new Set(times)];
  }

  /**
   * Create custom album from selected media
   */
  createAlbum(
    tripId: string,
    name: string,
    mediaIds: string[],
    description?: string
  ): MemoryAlbum {
    const album: MemoryAlbum = {
      id: `custom-${Date.now()}`,
      tripId,
      name,
      description,
      mediaIds,
      emotion: "curated",
      coverImageId: mediaIds[0],
      createdAt: Date.now(),
      isPublic: false,
      shares: 0,
    };

    if (!this.albumsCache.has(tripId)) {
      this.albumsCache.set(tripId, []);
    }
    this.albumsCache.get(tripId)!.push(album);
    return album;
  }

  /**
   * Share album and track shares
   */
  shareAlbum(tripId: string, albumId: string): boolean {
    const albums = this.albumsCache.get(tripId) || [];
    const album = albums.find(a => a.id === albumId);
    if (album) {
      album.isPublic = true;
      album.shares = (album.shares ?? 0) + 1;
      return true;
    }
    return false;
  }

  /**
   * Generate confidence-weighted photo highlight score
   */
  private generateHighlightReason(media: TripMedia): string {
    const reasons = [
      `Perfectly captured ${media.emotion} moment with ${(media.confidence * 100).toFixed(0)}% confidence`,
      `Stunning ${media.emotion} expression caught at ${media.location?.name || "this location"}`,
      `Peak emotion frame — bright and clear composition`,
      `Spontaneous ${media.emotion} moment with excellent clarity`,
      `Share-worthy memory that captures the essence of the trip`,
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Get statistics about memory collection
   */
  getStats(tripId: string) {
    const media = this.getMedia(tripId);
    const highlights = this.detectHighlights(tripId);

    const emotionBreakdown = new Map<string, number>();
    media.forEach(m => {
      const emotion = m.emotion || "unidentified";
      emotionBreakdown.set(emotion, (emotionBreakdown.get(emotion) ?? 0) + 1);
    });

    return {
      totalPhotos: media.filter(m => m.type === "photo").length,
      totalVideos: media.filter(m => m.type === "video").length,
      highlightMoments: highlights.length,
      averageConfidence:
        media.length > 0
          ? media.reduce((sum, m) => sum + m.confidence, 0) / media.length
          : 0,
      emotionBreakdown: Object.fromEntries(emotionBreakdown),
      capturedLocations: [
        ...new Set(media.map(m => m.location?.name).filter(Boolean)),
      ].length,
    };
  }
}

export default new MemoryCurationService();
