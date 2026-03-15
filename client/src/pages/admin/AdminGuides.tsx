import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Plus, Loader2, Edit, Trash2 } from "lucide-react";

function GuideForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    destination: "",
    country: "",
    heroImageUrl: "",
    overview: "",
    currency: "",
    language: "",
    timezone: "",
    bestTimeToVisit: "",
    weatherInfo: "",
    tips: "",
    emergencyPolice: "",
    emergencyAmbulance: "",
    emergencyFire: "",
  });

  const createGuide = trpc.guides.create.useMutation({
    onSuccess: () => {
      toast.success("Guide created!");
      onSuccess();
    },
    onError: e => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destination) {
      toast.error("Destination is required");
      return;
    }

    const tips = form.tips.split("\n").filter(t => t.trim());
    const emergency: Record<string, string> = {};
    if (form.emergencyPolice) emergency["Police"] = form.emergencyPolice;
    if (form.emergencyAmbulance)
      emergency["Ambulance"] = form.emergencyAmbulance;
    if (form.emergencyFire) emergency["Fire"] = form.emergencyFire;

    createGuide.mutate({
      destination: form.destination,
      country: form.country || undefined,
      heroImageUrl: form.heroImageUrl || undefined,
      overview: form.overview || undefined,
      currency: form.currency || undefined,
      language: form.language || undefined,
      timezone: form.timezone || undefined,
      bestTimeToVisit: form.bestTimeToVisit || undefined,
      weatherInfo: form.weatherInfo || undefined,
      tipsJson: tips.length > 0 ? tips : undefined,
      emergencyNumbers:
        Object.keys(emergency).length > 0 ? emergency : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="font-sans text-sm">Destination *</Label>
          <Input
            value={form.destination}
            onChange={e =>
              setForm(f => ({ ...f, destination: e.target.value }))
            }
            placeholder="e.g., Maui"
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Country</Label>
          <Input
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            placeholder="e.g., USA"
            className="mt-1.5 font-sans"
          />
        </div>
      </div>
      <div>
        <Label className="font-sans text-sm">Hero Image URL</Label>
        <Input
          value={form.heroImageUrl}
          onChange={e => setForm(f => ({ ...f, heroImageUrl: e.target.value }))}
          placeholder="https://..."
          className="mt-1.5 font-sans"
        />
      </div>
      <div>
        <Label className="font-sans text-sm">Overview</Label>
        <Textarea
          value={form.overview}
          onChange={e => setForm(f => ({ ...f, overview: e.target.value }))}
          className="mt-1.5 font-sans"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="font-sans text-sm">Currency</Label>
          <Input
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            placeholder="e.g., USD"
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Language</Label>
          <Input
            value={form.language}
            onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
            placeholder="e.g., English"
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Timezone</Label>
          <Input
            value={form.timezone}
            onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
            placeholder="e.g., HST (UTC-10)"
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm">Best Time to Visit</Label>
          <Input
            value={form.bestTimeToVisit}
            onChange={e =>
              setForm(f => ({ ...f, bestTimeToVisit: e.target.value }))
            }
            placeholder="e.g., April–October"
            className="mt-1.5 font-sans"
          />
        </div>
      </div>
      <div>
        <Label className="font-sans text-sm">Weather Info</Label>
        <Textarea
          value={form.weatherInfo}
          onChange={e => setForm(f => ({ ...f, weatherInfo: e.target.value }))}
          className="mt-1.5 font-sans"
          rows={2}
        />
      </div>
      <div>
        <Label className="font-sans text-sm">
          Jessica's Tips (one per line)
        </Label>
        <Textarea
          value={form.tips}
          onChange={e => setForm(f => ({ ...f, tips: e.target.value }))}
          placeholder="Bring reef-safe sunscreen&#10;Book luau tickets in advance&#10;Rent a car for the Road to Hana"
          className="mt-1.5 font-sans"
          rows={4}
        />
      </div>
      <div>
        <Label className="font-sans text-sm">Emergency Numbers</Label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <Input
            value={form.emergencyPolice}
            onChange={e =>
              setForm(f => ({ ...f, emergencyPolice: e.target.value }))
            }
            placeholder="Police"
            className="font-sans"
          />
          <Input
            value={form.emergencyAmbulance}
            onChange={e =>
              setForm(f => ({ ...f, emergencyAmbulance: e.target.value }))
            }
            placeholder="Ambulance"
            className="font-sans"
          />
          <Input
            value={form.emergencyFire}
            onChange={e =>
              setForm(f => ({ ...f, emergencyFire: e.target.value }))
            }
            placeholder="Fire"
            className="font-sans"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground font-sans"
        disabled={createGuide.isPending}
      >
        {createGuide.isPending && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Create Guide
      </Button>
    </form>
  );
}

export default function AdminGuides() {
  const { data: guides, isLoading, refetch } = trpc.guides.list.useQuery();
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout
      title="Destination Guides"
      subtitle="Manage travel guides for your clients"
    >
      <div className="flex items-center justify-between mb-6">
        <div />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground font-sans">
              <Plus className="w-4 h-4 mr-2" /> New Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">
                Create Destination Guide
              </DialogTitle>
            </DialogHeader>
            <GuideForm
              onSuccess={() => {
                setOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {!isLoading && (!guides || guides.length === 0) && (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            No Guides Yet
          </h3>
          <Button
            className="mt-2 bg-primary text-primary-foreground font-sans"
            onClick={() => setOpen(true)}
          >
            Create First Guide
          </Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides?.map(guide => (
          <Card
            key={guide.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-32 bg-muted relative">
              {guide.heroImageUrl ? (
                <img
                  src={guide.heroImageUrl}
                  alt={guide.destination}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Globe className="w-10 h-10 text-primary/40" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif font-semibold text-foreground">
                {guide.destination}
              </h3>
              {guide.country && (
                <p className="text-muted-foreground font-sans text-xs">
                  {guide.country}
                </p>
              )}
              {guide.overview && (
                <p className="text-muted-foreground font-sans text-xs mt-2 line-clamp-2">
                  {guide.overview}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
