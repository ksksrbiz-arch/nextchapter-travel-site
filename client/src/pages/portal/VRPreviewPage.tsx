import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Search, ExternalLink, Eye, MapPin, Loader2 } from "lucide-react";

const FALLBACK_TOURS = [
  {
    destination: "Paris, France",
    name: "Eiffel Tower Sky View",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!4v1620000000000!6m8!1m7!1sCAoSLEFGMVFpcE93RG9pUmJpVlc!2m2!1d48.8584!2d2.2945!3f180!4f0!5f0.7820865974627469",
  },
  {
    destination: "Walt Disney World, FL",
    name: "Magic Kingdom Castle",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.4!2d-81.5812!3d28.4177",
  },
  {
    destination: "Santorini, Greece",
    name: "Caldera Sunset Walk",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.3!2d25.395!3d36.4174",
  },
];

export default function VRPreviewPage() {
  const [query, setQuery] = useState("");
  const { data: guides, isLoading } = trpc.guides.list.useQuery();

  const guideTours = useMemo(() => {
    return (
      guides
        ?.filter(g => Boolean((g as { vrTourUrl?: string | null }).vrTourUrl))
        .map(g => ({
          destination: g.destination,
          name: `${g.destination} guided tour`,
          embedUrl:
            (g as { vrTourUrl: string }).vrTourUrl,
        })) ?? []
    );
  }, [guides]);

  const all = [...guideTours, ...FALLBACK_TOURS];
  const filtered = query
    ? all.filter(t =>
        t.destination.toLowerCase().includes(query.toLowerCase())
      )
    : all;

  return (
    <PortalLayout
      title="Virtual Tour Previews"
      subtitle="Step inside before you book"
    >
      <div className="max-w-md mb-6 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search destinations…"
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-muted-foreground text-sm flex items-center gap-2 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading tours…
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(tour => (
          <Card key={`${tour.destination}-${tour.name}`} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <iframe
                src={tour.embedUrl}
                title={`${tour.name} VR preview`}
                className="w-full h-full border-0"
                loading="lazy"
                allow="accelerometer; gyroscope; fullscreen"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-serif font-semibold text-foreground truncate flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    {tour.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {tour.destination}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="flex-shrink-0"
                >
                  <a
                    href={tour.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-sans text-foreground/70">
              No tours match "{query}". Try a different destination.
            </p>
          </CardContent>
        </Card>
      )}
    </PortalLayout>
  );
}
