import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Leaf, Plane, Hotel, TreePine, Wind, ShieldCheck } from "lucide-react";

// Published rough CO2 factors (kg CO2e per pax)
//   Short-haul flight (<1500km): ~120 g/pax-km
//   Medium-haul (1500-4000km): ~100 g/pax-km
//   Long-haul (>4000km): ~85 g/pax-km
//   Hotel: ~30 kg/night (average) — eco-certified ~12 kg/night
function flightEmissions(km: number, cabin: string, direct: boolean): number {
  const factor = km < 1500 ? 0.12 : km < 4000 ? 0.1 : 0.085;
  const cabinMultiplier =
    cabin === "first" ? 4 : cabin === "business" ? 2.2 : cabin === "premium" ? 1.5 : 1;
  const detourPenalty = direct ? 1 : 1.15;
  return Math.round(km * factor * cabinMultiplier * detourPenalty);
}

function hotelEmissions(nights: number, eco: boolean): number {
  return Math.round(nights * (eco ? 12 : 30));
}

export default function SustainabilityPage() {
  const [km, setKm] = useState(5000);
  const [cabin, setCabin] = useState("economy");
  const [direct, setDirect] = useState(true);
  const [nights, setNights] = useState(7);
  const [eco, setEco] = useState(false);

  const flight = useMemo(
    () => flightEmissions(km, cabin, direct),
    [km, cabin, direct]
  );
  const hotel = useMemo(() => hotelEmissions(nights, eco), [nights, eco]);
  const total = flight + hotel;

  // Trees needed to offset over a year (avg ~21 kg CO2 absorbed per tree per year)
  const trees = Math.ceil(total / 21);

  return (
    <PortalLayout
      title="Sustainable Travel"
      subtitle="Travel beautifully, tread lightly"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-5">
            <Plane className="w-5 h-5 text-emerald-700 mb-2" />
            <p className="text-xs text-emerald-700 font-sans uppercase tracking-wide mb-1">
              Flight
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-900">
              {flight} kg
            </p>
            <p className="text-xs text-emerald-700/80 font-sans mt-1">
              CO₂ equivalent · per traveler
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-5">
            <Hotel className="w-5 h-5 text-emerald-700 mb-2" />
            <p className="text-xs text-emerald-700 font-sans uppercase tracking-wide mb-1">
              Hotel stay
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-900">
              {hotel} kg
            </p>
            <p className="text-xs text-emerald-700/80 font-sans mt-1">
              {eco ? "Eco-certified property" : "Standard property"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-100 border-emerald-300">
          <CardContent className="p-5">
            <TreePine className="w-5 h-5 text-emerald-800 mb-2" />
            <p className="text-xs text-emerald-800 font-sans uppercase tracking-wide mb-1">
              Total · offset
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-900">
              {total} kg
            </p>
            <p className="text-xs text-emerald-800/80 font-sans mt-1">
              ≈ {trees} {trees === 1 ? "tree" : "trees"} for a year
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4 max-w-2xl">
          <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700" /> Carbon calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Round-trip distance (km)</Label>
              <Input
                type="number"
                value={km}
                onChange={e => setKm(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div>
              <Label>Cabin class</Label>
              <Select value={cabin} onValueChange={setCabin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hotel nights</Label>
              <Input
                type="number"
                value={nights}
                onChange={e =>
                  setNights(Math.max(0, Number(e.target.value) || 0))
                }
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={direct}
                  onChange={e => setDirect(e.target.checked)}
                />
                <span className="text-sm font-sans">Direct flight</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eco}
                  onChange={e => setEco(e.target.checked)}
                />
                <span className="text-sm font-sans">Eco-certified hotel</span>
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            Estimates use published per-pax-km factors and per-night averages.
            Actual emissions vary by aircraft, occupancy, and energy mix.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif font-semibold flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Green
              logistics
            </h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Look for the green badge on your bookings. We flag direct flights
              and eco-certified hotels (LEED, Green Key, EarthCheck) to make
              choosing the lower-impact option effortless.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-0">
                Direct flight
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-0">
                Green Key hotel
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-0">
                EV transfer
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif font-semibold flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-sky-700" /> Conscious travel filter
            </h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Prefer slower, nature-based, or "dry" itineraries? Mention it in
              your trip notes and Jessica will lean into wellness retreats,
              forest-bathing days, and screen-light evenings.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
