import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Globe,
  MapPin,
  DollarSign,
  Languages,
  Clock,
  Sun,
  Phone,
  Lightbulb,
  Loader2,
  Search,
} from "lucide-react";
import { NoGuidesEmptyState, NoResults } from "@/components/ui/empty-states";
import { GuidesSkeleton } from "@/components/ui/skeletons";

export default function Guides() {
  const { data: guides, isLoading } = trpc.guides.list.useQuery();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered =
    guides?.filter(
      g =>
        g.destination.toLowerCase().includes(search.toLowerCase()) ||
        (g.country ?? "").toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const selectedGuide =
    selected !== null ? guides?.find(g => g.id === selected) : null;

  if (selectedGuide) {
    const tips = selectedGuide.tipsJson as string[] | null;
    const emergency = selectedGuide.emergencyNumbers as Record<
      string,
      string
    > | null;

    return (
      <PortalLayout
        title={selectedGuide.destination}
        subtitle={selectedGuide.country ?? "Destination Guide"}
      >
        <button
          onClick={() => setSelected(null)}
          className="mb-6 text-sm font-sans text-secondary hover:underline flex items-center gap-1"
        >
          ← Back to all guides
        </button>

        {/* Hero */}
        {selectedGuide.heroImageUrl && (
          <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
            <img
              src={selectedGuide.heroImageUrl}
              alt={selectedGuide.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-3xl font-serif font-bold">
                {selectedGuide.destination}
              </h2>
              {selectedGuide.country && (
                <p className="text-white/80 font-sans">
                  {selectedGuide.country}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Overview */}
          {selectedGuide.overview && (
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-secondary" /> Overview
                </h3>
                <p className="text-foreground/80 font-sans leading-relaxed">
                  {selectedGuide.overview}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick facts */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif font-semibold text-foreground mb-4">
                Quick Facts
              </h3>
              <div className="space-y-3">
                {selectedGuide.currency && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Currency
                      </p>
                      <p className="text-sm font-sans font-medium text-foreground">
                        {selectedGuide.currency}
                      </p>
                    </div>
                  </div>
                )}
                {selectedGuide.language && (
                  <div className="flex items-center gap-3">
                    <Languages className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Language
                      </p>
                      <p className="text-sm font-sans font-medium text-foreground">
                        {selectedGuide.language}
                      </p>
                    </div>
                  </div>
                )}
                {selectedGuide.timezone && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Timezone
                      </p>
                      <p className="text-sm font-sans font-medium text-foreground">
                        {selectedGuide.timezone}
                      </p>
                    </div>
                  </div>
                )}
                {selectedGuide.bestTimeToVisit && (
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-sans">
                        Best Time to Visit
                      </p>
                      <p className="text-sm font-sans font-medium text-foreground">
                        {selectedGuide.bestTimeToVisit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weather */}
          {selectedGuide.weatherInfo && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-secondary" /> Weather
                </h3>
                <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                  {selectedGuide.weatherInfo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-secondary" /> Jessica's
                  Tips
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {i + 1}
                      </span>
                      <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                        {tip}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Emergency numbers */}
          {emergency && Object.keys(emergency).length > 0 && (
            <Card className="border-red-200">
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" /> Emergency Numbers
                </h3>
                <div className="space-y-2">
                  {Object.entries(emergency).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-sans text-muted-foreground">
                        {key}
                      </span>
                      <a
                        href={`tel:${value}`}
                        className="text-sm font-sans font-bold text-red-600 hover:underline"
                      >
                        {value}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title="Destination Guides"
      subtitle="Local tips and essential info for your destinations"
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search destinations..."
          className="pl-9 font-sans"
        />
      </div>

      {/* Loading */}
      {isLoading && <GuidesSkeleton />}

      {/* Empty state */}
      {!isLoading &&
        filtered.length === 0 &&
        (search ? <NoResults query={search} /> : <NoGuidesEmptyState />)}

      {/* Guides grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(guide => (
          <Card
            key={guide.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelected(guide.id)}
          >
            <div className="relative h-40 bg-muted">
              {guide.heroImageUrl ? (
                <img
                  src={guide.heroImageUrl}
                  alt={guide.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Globe className="w-12 h-12 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-serif font-bold text-lg leading-tight">
                  {guide.destination}
                </h3>
                {guide.country && (
                  <p className="text-white/80 text-xs font-sans">
                    {guide.country}
                  </p>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              {guide.overview && (
                <p className="text-muted-foreground font-sans text-sm line-clamp-2 mb-3">
                  {guide.overview}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {guide.currency && (
                  <Badge className="bg-muted text-muted-foreground border-0 font-sans text-xs">
                    💰 {guide.currency}
                  </Badge>
                )}
                {guide.language && (
                  <Badge className="bg-muted text-muted-foreground border-0 font-sans text-xs">
                    🗣️ {guide.language}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}
