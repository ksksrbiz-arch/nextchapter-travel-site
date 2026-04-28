import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Accessibility, Heart, Brain, Loader2, Save } from "lucide-react";

const MOBILITY_OPTIONS = [
  "Wheelchair user",
  "Limited walking distance",
  "Mobility scooter",
  "Cane / walker",
  "Step-free access required",
  "Roll-in shower required",
];

const NEURO_OPTIONS = [
  "Quiet / sensory-friendly spaces",
  "Predictable schedule",
  "Written instructions preferred",
  "Reduced crowds",
  "Familiar foods",
];

const MEDICAL_OPTIONS = [
  "Refrigerated medication",
  "Oxygen tank",
  "CPAP machine",
  "Insulin pump",
  "Frequent rest breaks",
  "Dialysis access",
];

const DIET_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Kosher",
  "Halal",
  "Nut allergy",
  "Shellfish allergy",
  "Dairy-free",
];

function CheckGroup({
  title,
  icon: Icon,
  options,
  values,
  onToggle,
}: {
  title: string;
  icon: React.ElementType;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-serif font-semibold text-foreground flex items-center gap-2 mb-4">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options.map(o => {
            const checked = values.includes(o);
            return (
              <label
                key={o}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer min-h-[44px]"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggle(o)}
                />
                <span className="font-sans text-sm">{o}</span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccessibleTravelPage() {
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.accessibility.get.useQuery();
  const upsert = trpc.accessibility.upsert.useMutation({
    onSuccess: () => {
      utils.accessibility.get.invalidate();
      toast.success("Accessibility profile saved");
    },
    onError: e => toast.error(e.message),
  });

  const [mobility, setMobility] = useState<string[]>([]);
  const [neuro, setNeuro] = useState<string[]>([]);
  const [medical, setMedical] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);
  const [serviceAnimal, setServiceAnimal] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!profile) return;
    setMobility((profile.mobilityNeeds as string[] | null) ?? []);
    setNeuro((profile.neurodivergentNeeds as string[] | null) ?? []);
    setMedical((profile.medicalNeeds as string[] | null) ?? []);
    setDiet((profile.dietaryRestrictions as string[] | null) ?? []);
    setServiceAnimal(profile.serviceAnimal ?? false);
    setNotes(profile.notes ?? "");
  }, [profile]);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    v: string
  ) => setter(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));

  const save = () => {
    upsert.mutate({
      mobilityNeeds: mobility,
      neurodivergentNeeds: neuro,
      medicalNeeds: medical,
      dietaryRestrictions: diet,
      serviceAnimal,
      notes: notes || undefined,
    });
  };

  return (
    <PortalLayout
      title="Accessible Travel"
      subtitle="Tell us how to make every trip work for you"
    >
      {isLoading && (
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading profile…
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Accessibility className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-1">
                  Your needs power your trip
                </h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  Jessica uses this profile to filter recommendations, ensure
                  step-free routes, request appropriate hotel rooms, and arrange
                  meals that work for you. Update it any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <CheckGroup
          title="Mobility & accessibility"
          icon={Accessibility}
          options={MOBILITY_OPTIONS}
          values={mobility}
          onToggle={v => toggle(setMobility, v)}
        />
        <CheckGroup
          title="Neurodivergent-friendly preferences"
          icon={Brain}
          options={NEURO_OPTIONS}
          values={neuro}
          onToggle={v => toggle(setNeuro, v)}
        />
        <CheckGroup
          title="Medical considerations"
          icon={Heart}
          options={MEDICAL_OPTIONS}
          values={medical}
          onToggle={v => toggle(setMedical, v)}
        />
        <CheckGroup
          title="Dietary restrictions"
          icon={Heart}
          options={DIET_OPTIONS}
          values={diet}
          onToggle={v => toggle(setDiet, v)}
        />

        <Card>
          <CardContent className="p-5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <Checkbox
                checked={serviceAnimal}
                onCheckedChange={c => setServiceAnimal(!!c)}
              />
              <span className="font-sans text-sm">
                I travel with a service animal
              </span>
              {serviceAnimal && (
                <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
                  Documented
                </Badge>
              )}
            </label>
            <div>
              <Label>Anything else Jessica should know?</Label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Specific medications, preferred airlines/hotels with proven accessibility, anything that's helped on past trips…"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 flex justify-end">
          <Button
            onClick={save}
            disabled={upsert.isPending}
            className="font-sans shadow-lg"
          >
            {upsert.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save profile
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}
