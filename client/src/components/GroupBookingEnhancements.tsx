/**
 * GroupBookingEnhancements.tsx
 *
 * Cabin/room assignment grid for cruises + multi-cabin trips, and a
 * multi-generational family-tree manifest. Pure client-side state — designed
 * to slot into existing GroupTravelCoordination flow.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Ship,
  Users,
  UserPlus,
  Trash2,
  Bed,
  GitBranch,
} from "lucide-react";

type Pax = {
  id: string;
  name: string;
  relation: string; // e.g. "Parent", "Child", "Grandparent"
  generation: number; // 1=oldest, increments down
  cabinId?: string;
};

type Cabin = {
  id: string;
  label: string;
  capacity: number;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function CabinAssignmentGrid() {
  const [cabins, setCabins] = useState<Cabin[]>([
    { id: uid(), label: "Suite 8001", capacity: 2 },
    { id: uid(), label: "Stateroom 7110", capacity: 4 },
  ]);
  const [pax, setPax] = useState<Pax[]>([]);
  const [nameInput, setNameInput] = useState("");

  const addCabin = () => {
    setCabins(c => [
      ...c,
      { id: uid(), label: `Cabin ${c.length + 1}`, capacity: 2 },
    ]);
  };
  const addPax = () => {
    if (!nameInput.trim()) return;
    setPax(p => [
      ...p,
      {
        id: uid(),
        name: nameInput.trim(),
        relation: "Traveler",
        generation: 2,
      },
    ]);
    setNameInput("");
  };
  const updatePax = (id: string, patch: Partial<Pax>) =>
    setPax(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  const removePax = (id: string) =>
    setPax(prev => prev.filter(p => p.id !== id));
  const removeCabin = (id: string) => {
    setCabins(prev => prev.filter(c => c.id !== id));
    setPax(prev =>
      prev.map(p => (p.cabinId === id ? { ...p, cabinId: undefined } : p))
    );
  };

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("text/pax", id);
  };
  const onDropToCabin = (cabinId: string | undefined) => (
    e: React.DragEvent
  ) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/pax");
    if (id) updatePax(id, { cabinId });
  };

  const unassigned = pax.filter(p => !p.cabinId);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-semibold flex items-center gap-2">
            <Ship className="w-4 h-4 text-primary" /> Cabin / Room Assignments
          </h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={addCabin}>
              <Bed className="w-3.5 h-3.5 mr-1" /> Add cabin
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Add traveler by name…"
            onKeyDown={e => {
              if (e.key === "Enter") addPax();
            }}
          />
          <Button size="sm" onClick={addPax}>
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>

        {/* Unassigned pool */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={onDropToCabin(undefined)}
          className="rounded-xl border-2 border-dashed border-border p-3 min-h-[60px]"
        >
          <p className="text-xs text-muted-foreground font-sans mb-2">
            Unassigned ({unassigned.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(p => (
              <div
                key={p.id}
                draggable
                onDragStart={onDragStart(p.id)}
                className="px-2 py-1 rounded-lg bg-muted text-sm font-sans cursor-move flex items-center gap-1.5"
              >
                {p.name}
                <button
                  onClick={() => removePax(p.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {unassigned.length === 0 && (
              <span className="text-xs text-muted-foreground font-sans italic">
                Drag travelers here to unassign
              </span>
            )}
          </div>
        </div>

        {/* Cabin grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cabins.map(cabin => {
            const occupants = pax.filter(p => p.cabinId === cabin.id);
            const overCapacity = occupants.length > cabin.capacity;
            return (
              <div
                key={cabin.id}
                onDragOver={e => e.preventDefault()}
                onDrop={onDropToCabin(cabin.id)}
                className={`rounded-xl border p-3 min-h-[100px] ${
                  overCapacity
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Input
                    value={cabin.label}
                    onChange={e =>
                      setCabins(prev =>
                        prev.map(c =>
                          c.id === cabin.id
                            ? { ...c, label: e.target.value }
                            : c
                        )
                      )
                    }
                    className="h-7 text-sm font-sans font-semibold w-44"
                  />
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        overCapacity ? "border-destructive text-destructive" : ""
                      }
                    >
                      {occupants.length}/{cabin.capacity}
                    </Badge>
                    <button
                      onClick={() => removeCabin(cabin.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove cabin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {occupants.map(p => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={onDragStart(p.id)}
                      className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-sans cursor-move"
                    >
                      {p.name}
                    </div>
                  ))}
                  {occupants.length === 0 && (
                    <span className="text-xs text-muted-foreground italic font-sans">
                      Drop travelers here
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function GroupManifest() {
  const [members, setMembers] = useState<Pax[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Parent");
  const [generation, setGeneration] = useState(2);

  const add = () => {
    if (!name.trim()) return;
    setMembers(m => [
      ...m,
      { id: uid(), name: name.trim(), relation, generation },
    ]);
    setName("");
  };

  const remove = (id: string) =>
    setMembers(prev => prev.filter(m => m.id !== id));

  const generations = Array.from(
    new Set(members.map(m => m.generation))
  ).sort((a, b) => a - b);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <h3 className="font-serif font-semibold flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          Multi-generational Manifest
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={relation}
            onChange={e => setRelation(e.target.value)}
            placeholder="Relation (e.g. Grandparent)"
          />
          <div>
            <Label className="text-xs">Generation (1 = oldest)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={generation}
              onChange={e =>
                setGeneration(Math.max(1, Number(e.target.value) || 1))
              }
            />
          </div>
          <Button onClick={add}>
            <UserPlus className="w-4 h-4 mr-1" /> Add member
          </Button>
        </div>

        {generations.length === 0 && (
          <p className="text-sm text-muted-foreground font-sans italic">
            Add family members above to build the manifest. Use generation
            numbers (1 = oldest) to group them.
          </p>
        )}

        <div className="space-y-3">
          {generations.map(g => (
            <div key={g} className="border-l-2 border-primary/40 pl-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-sans mb-1">
                Generation {g}
              </p>
              <div className="flex flex-wrap gap-2">
                {members
                  .filter(m => m.generation === g)
                  .map(m => (
                    <Badge
                      key={m.id}
                      variant="outline"
                      className="text-xs font-sans flex items-center gap-1.5"
                    >
                      <Users className="w-3 h-3" />
                      {m.name}{" "}
                      <span className="text-muted-foreground">
                        · {m.relation}
                      </span>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-muted-foreground hover:text-destructive ml-1"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
