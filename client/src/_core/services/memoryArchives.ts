/**
 * Memory Archives Service
 * Manages long-term storage and retrieval of curated trip memories
 * Organizes albums, highlights, and memories by date, emotion, and trip
 * Provides search and filtering capabilities for memory discovery
 */

export interface ArchivedMemory {
  id: string;
  tripId: string;
  tripName: string;
  destination: string;
  startDate: number;
  endDate: number;
  archives: MemoryArchive[];
  highlights: string[]; // top 3 media IDs
  emotionalSummary: string; // overall trip emotion
  stats: {
    totalMedia: number;
    totalAlbums: number;
    duration: number; // days
    avgDailyMood: number; // 0-1
  };
  createdAt: number;
  lastAccessed: number;
}

export interface MemoryArchive {
  id: string;
  name: string;
  mediaIds: string[];
  emotion: string;
  description?: string;
  metadata: {
    createdAt: number;
    imageCount: number;
    videoCount: number;
    totalSize: number; // bytes
  };
}

export interface TripRecommendation {
  id: string;
  title: string;
  destination: string;
  description: string;
  reason: string; // why recommended
  confidence: number; // 0-1
  similarity: string[]; // shared characteristics
  estimatedBudget: number;
  duration: number; // days
  bestSeason: string;
  activities: string[];
  accommodationType: string;
  images: string[];
  bookingUrl?: string;
}

export interface TripSearchMatch {
  memoryId: string;
  tripName: string;
  destination: string;
  score: number; // match score 0-1
  sharedActivities: string[];
  sharedEmotions: string[];
}

interface TripProfile {
  destination: string;
  duration: number;
  activities: string[];
  emotion: string;
  budget: number;
  travelStyle: string; // adventure, luxury, cultural, relaxation, family
  season: string;
}

class MemoryArchivesService {
  private archives: Map<string, ArchivedMemory> = new Map();
  private searchIndex: Map<string, string[]> = new Map(); // searchTerm -> memoryIds

  /**
   * Archive a completed trip's memories
   */
  archiveTrip(
    tripId: string,
    tripName: string,
    destination: string,
    startDate: number,
    endDate: number,
    albums: Array<{ name: string; mediaIds: string[]; emotion: string }>,
    highlights: string[],
    emotionalSummary: string
  ): ArchivedMemory {
    const duration = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000));

    const archives: MemoryArchive[] = albums.map((album, idx) => ({
      id: `archive-${tripId}-${idx}`,
      name: album.name,
      mediaIds: album.mediaIds,
      emotion: album.emotion,
      metadata: {
        createdAt: Date.now(),
        imageCount: album.mediaIds.length,
        videoCount: 0,
        totalSize: album.mediaIds.length * 2000000, // 2MB per media est.
      },
    }));

    const archived: ArchivedMemory = {
      id: `mem-${tripId}-${Date.now()}`,
      tripId,
      tripName,
      destination,
      startDate,
      endDate,
      archives,
      highlights,
      emotionalSummary,
      stats: {
        totalMedia: albums.reduce((sum, a) => sum + a.mediaIds.length, 0),
        totalAlbums: albums.length,
        duration,
        avgDailyMood: 0.82 + Math.random() * 0.15, // 82-97%
      },
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    };

    this.archives.set(archived.id, archived);
    this.indexMemory(archived);
    return archived;
  }

  /**
   * Update last accessed time
   */
  accessMemory(memoryId: string): boolean {
    const memory = this.archives.get(memoryId);
    if (memory) {
      memory.lastAccessed = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Get all archived memories
   */
  getAllArchives(): ArchivedMemory[] {
    return Array.from(this.archives.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  /**
   * Get archived memories by destination
   */
  getArchivesByDestination(destination: string): ArchivedMemory[] {
    return Array.from(this.archives.values()).filter(m =>
      m.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  /**
   * Search archives by keyword
   */
  searchArchives(query: string): ArchivedMemory[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.archives.values()).filter(
      m =>
        m.tripName.toLowerCase().includes(queryLower) ||
        m.destination.toLowerCase().includes(queryLower) ||
        m.emotionalSummary.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Analyze trip patterns for rebooking recommendations
   */
  analyzeTripProfile(memory: ArchivedMemory): TripProfile {
    return {
      destination: memory.destination,
      duration: memory.stats.duration,
      activities: this.extractActivities(memory),
      emotion: memory.emotionalSummary,
      budget: this.estimateBudget(memory),
      travelStyle: this.determineTravelStyle(memory),
      season: this.guessSeason(memory),
    };
  }

  /**
   * Find similar past trips
   */
  findSimilarMemories(targetMemory: ArchivedMemory): TripSearchMatch[] {
    const targetProfile = this.analyzeTripProfile(targetMemory);
    const similarTrips: TripSearchMatch[] = [];

    Array.from(this.archives.values()).forEach(memory => {
      if (memory.id === targetMemory.id) return;

      const score = this.calculateSimilarity(
        targetProfile,
        this.analyzeTripProfile(memory)
      );

      if (score > 0.6) {
        // 60% similarity threshold
        const targetActivities = this.extractActivities(targetMemory);
        const memoryActivities = this.extractActivities(memory);
        const sharedActivities = targetActivities.filter(a =>
          memoryActivities.includes(a)
        );

        similarTrips.push({
          memoryId: memory.id,
          tripName: memory.tripName,
          destination: memory.destination,
          score,
          sharedActivities,
          sharedEmotions: [targetProfile.emotion],
        });
      }
    });

    return similarTrips.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate rebooking recommendations
   */
  generateRecommendations(memory: ArchivedMemory): TripRecommendation[] {
    const profile = this.analyzeTripProfile(memory);
    const recommendations: TripRecommendation[] = [];

    // Generate recommendations based on previous trip
    const _similarTrips = this.findSimilarMemories(memory);

    // Recommendation 1: Return to same destination
    recommendations.push({
      id: `rec-return-${memory.id}`,
      title: `Return to ${memory.destination}`,
      destination: memory.destination,
      description: `Experience ${memory.destination} again with fresh perspectives`,
      reason: `You loved your previous trip to ${memory.destination} (${profile.emotion} experience)`,
      confidence: 0.92,
      similarity: ["same destination", "familiar activities", profile.emotion],
      estimatedBudget: profile.budget * 1.1, // 10% more for inflation
      duration: profile.duration,
      bestSeason: this.guessSeason(memory),
      activities: profile.activities,
      accommodationType: "Similar to previous",
      images: [
        `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300`,
      ],
    });

    // Recommendation 2: Similar destination with different vibe
    const alternatives = [
      {
        dest: "Paris",
        emotion: "romantic",
        activities: ["museums", "dining", "culture"],
      },
      {
        dest: "Tokyo",
        emotion: "adventurous",
        activities: ["exploration", "food", "culture"],
      },
      {
        dest: "Costa Rica",
        emotion: "adventurous",
        activities: ["hiking", "nature", "wildlife"],
      },
      {
        dest: "Greece",
        emotion: "relaxed",
        activities: ["beach", "culture", "hiking"],
      },
      {
        dest: "Thailand",
        emotion: "adventurous",
        activities: ["food", "beaches", "temples"],
      },
    ];

    const alternative =
      alternatives[Math.floor(Math.random() * alternatives.length)];

    recommendations.push({
      id: `rec-similar-${memory.id}`,
      title: `Explore ${alternative.dest}`,
      destination: alternative.dest,
      description: `Similar to ${profile.emotion} experience but with new discoveries`,
      reason: `Based on your ${profile.emotion} travel style and interest in ${profile.activities[0] || "exploration"}`,
      confidence: 0.78 + Math.random() * 0.15,
      similarity: [alternative.emotion, ...alternative.activities.slice(0, 2)],
      estimatedBudget: profile.budget,
      duration: profile.duration + Math.floor(Math.random() * 3) - 1,
      bestSeason: this.guessSeason(memory) || "Year-round",
      activities: alternative.activities,
      accommodationType:
        profile.travelStyle === "luxury" ? "Luxury Resort" : "Boutique Hotel",
      images: [
        `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300`,
      ],
    });

    // Recommendation 3: Off-season variation
    recommendations.push({
      id: `rec-variation-${memory.id}`,
      title: `${memory.destination} in a Different Season`,
      destination: memory.destination,
      description: `Experience the same destination but with seasonal variations`,
      reason: `Revisit your favorite destination with new seasonal activities`,
      confidence: 0.85,
      similarity: ["same destination", "new perspective", "seasonal twist"],
      estimatedBudget: profile.budget * 0.9, // Typically cheaper off-season
      duration: profile.duration,
      bestSeason: profile.season === "Summer" ? "Winter" : "Summer",
      activities: profile.activities,
      accommodationType:
        profile.travelStyle === "luxury" ? "5-Star Hotel" : "4-Star Hotel",
      images: [
        `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300`,
      ],
    });

    return recommendations;
  }

  /**
   * Calculate similarity score between two trip profiles
   */
  private calculateSimilarity(
    profile1: TripProfile,
    profile2: TripProfile
  ): number {
    let score = 0;

    // Duration similarity
    const durationDiff = Math.abs(profile1.duration - profile2.duration);
    score += Math.max(0, 1 - durationDiff / 14) * 0.2;

    // Emotion match
    if (profile1.emotion === profile2.emotion) score += 0.3;

    // Activity overlap
    const activities1 = profile1.activities;
    const activities2 = profile2.activities;
    const overlap = activities1.filter(a => activities2.includes(a)).length;
    score += (overlap / Math.max(activities1.length, 1)) * 0.3;

    // Travel style match
    if (profile1.travelStyle === profile2.travelStyle) score += 0.2;

    return Math.min(1, score);
  }

  /**
   * Extract activities from memory
   */
  private extractActivities(memory: ArchivedMemory): string[] {
    return [
      ...new Set(
        memory.archives.flatMap(a => {
          const keywords = this.getActivityKeywords(a.emotion);
          return keywords;
        })
      ),
    ];
  }

  /**
   * Get activity keywords from emotion
   */
  private getActivityKeywords(emotion: string): string[] {
    const keywords: Record<string, string[]> = {
      happy: ["dining", "socializing", "entertainment", "food"],
      excited: ["adventure", "exploration", "sports", "activities"],
      surprised: [
        "shopping",
        "discovery",
        "unexpected finds",
        "unique experiences",
      ],
      relaxed: ["spa", "beaches", "wellness", "nature"],
      adventurous: [
        "hiking",
        "outdoor sports",
        "extreme activities",
        "exploration",
      ],
      tender: [
        "family time",
        "cultural sites",
        "intimate settings",
        "connections",
      ],
      grateful: ["nature", "sunsets", "meditation", "gratitude spots"],
      amazed: ["landmarks", "attractions", "scenic views", "photography"],
    };
    return keywords[emotion] || ["travel", "exploration", "sightseeing"];
  }

  /**
   * Estimate trip budget from archives
   */
  private estimateBudget(memory: ArchivedMemory): number {
    // Estimate based on trip stats and media capacity
    const baseDaily = 150; // $150/day base
    const perMediaCost = 50; // $50 per experience (rough)
    const mediaRatio =
      memory.stats.totalMedia / Math.max(memory.stats.duration, 1);
    return Math.round(
      (baseDaily * memory.stats.duration + mediaRatio * perMediaCost) *
        (0.8 + Math.random() * 0.4) // Add variance
    );
  }

  /**
   * Determine travel style from memory
   */
  private determineTravelStyle(memory: ArchivedMemory): string {
    const avgMood = memory.stats.avgDailyMood;
    const numAlbums = memory.stats.totalAlbums;

    if (avgMood > 0.9 && numAlbums > 5) return "luxury";
    if (avgMood > 0.85) return "adventure";
    if (avgMood > 0.8) return "cultural";
    return "relaxation";
  }

  /**
   * Guess season from trip dates
   */
  private guessSeason(memory: ArchivedMemory): string {
    const start = new Date(memory.startDate);
    const month = start.getMonth();

    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  }

  /**
   * Index memory for search
   */
  private indexMemory(memory: ArchivedMemory): void {
    const terms = [
      memory.destination.toLowerCase(),
      memory.tripName.toLowerCase(),
      memory.emotionalSummary.toLowerCase(),
    ];

    terms.forEach(term => {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, []);
      }
      this.searchIndex.get(term)!.push(memory.id);
    });
  }

  /**
   * Get statistics on all archived memories
   */
  getArchiveStats() {
    const all = Array.from(this.archives.values());
    const totalTrips = all.length;
    const totalDays = all.reduce((sum, m) => sum + m.stats.duration, 0);
    const totalMedia = all.reduce((sum, m) => sum + m.stats.totalMedia, 0);
    const avgMood =
      all.length > 0
        ? all.reduce((sum, m) => sum + m.stats.avgDailyMood, 0) / all.length
        : 0;

    const topDestinations = Array.from(
      new Map(
        all
          .map(m => m.destination)
          .reduce((acc: Record<string, number>, dest) => {
            acc[dest] = (acc[dest] || 0) + 1;
            return acc;
          }, {})
          .entries()
      )
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([dest, count]) => ({ destination: dest, visitCount: count }));

    return {
      totalTrips,
      totalDays,
      totalMedia,
      avgMood,
      topDestinations,
      avgTripDuration: Math.round(totalDays / Math.max(totalTrips, 1)),
    };
  }
}

export default new MemoryArchivesService();
