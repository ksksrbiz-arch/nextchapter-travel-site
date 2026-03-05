import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Trash2, CheckSquare, Loader2, Package } from "lucide-react";

const CATEGORIES = [
  "Clothing", "Toiletries", "Documents", "Electronics", "Medications",
  "Entertainment", "Beach/Pool", "Shoes", "Accessories", "Snacks", "General"
];

export default function PackingList() {
  const { data: trips } = trpc.trips.list.useQuery();
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const tripId = selectedTripId ?? trips?.[0]?.id ?? null;

  const { data: items, isLoading, refetch } = trpc.packing.list.useQuery(
    { tripId: tripId! },
    { enabled: !!tripId }
  );

  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  const createItem = trpc.packing.create.useMutation({
    onSuccess: () => { setNewItem(""); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const toggleItem = trpc.packing.toggle.useMutation({
    onSuccess: () => refetch(),
    onError: (e) => toast.error(e.message),
  });

  const deleteItem = trpc.packing.delete.useMutation({
    onSuccess: () => { toast.success("Item removed"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const handleAdd = () => {
    if (!newItem.trim() || !tripId) return;
    createItem.mutate({ tripId, item: newItem.trim(), category: newCategory });
  };

  const grouped = useMemo(() => {
    if (!items) return {};
    return items.reduce((acc, item) => {
      const cat = item.category ?? "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, typeof items>);
  }, [items]);

  const totalItems = items?.length ?? 0;
  const packedItems = items?.filter(i => i.isPacked).length ?? 0;
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <PortalLayout title="Packing List" subtitle="Never forget a thing">
      {/* Trip selector */}
      {trips && trips.length > 1 && (
        <div className="mb-6">
          <Select
            value={tripId?.toString() ?? ""}
            onValueChange={v => setSelectedTripId(Number(v))}
          >
            <SelectTrigger className="w-72 font-sans">
              <SelectValue placeholder="Select a trip" />
            </SelectTrigger>
            <SelectContent>
              {trips.map(t => (
                <SelectItem key={t.id} value={t.id.toString()} className="font-sans">
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Progress bar */}
      {totalItems > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-semibold text-foreground">Packing Progress</h3>
            <span className="font-sans text-sm font-medium text-secondary">
              {packedItems} / {totalItems} packed
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-muted-foreground font-sans text-sm mt-2">
            {progress === 100
              ? "🎉 All packed! You're ready to go!"
              : `${100 - progress}% remaining — keep going!`}
          </p>
        </div>
      )}

      {/* Add item */}
      {tripId && (
        <div className="mb-8 p-5 rounded-2xl border border-border bg-card">
          <h3 className="font-serif font-semibold text-foreground mb-4">Add Item</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-full sm:w-44 font-sans flex-shrink-0 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="font-sans">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="Add an item..."
              className="flex-1 font-sans min-h-[48px]"
            />
            <Button
              onClick={handleAdd}
              disabled={!newItem.trim() || createItem.isPending}
              className="bg-primary text-primary-foreground font-sans flex-shrink-0 min-h-[48px] w-full sm:w-auto"
            >
              {createItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tripId && totalItems === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Start Your Packing List</h3>
          <p className="text-muted-foreground font-sans text-sm">
            Add items above to build your personalized packing checklist.
          </p>
        </div>
      )}

      {!tripId && !isLoading && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">No Trip Selected</h3>
          <p className="text-muted-foreground font-sans text-sm">
            Your packing list will appear once you have a trip.
          </p>
        </div>
      )}

      {/* Grouped items */}
      {Object.entries(grouped).map(([category, catItems]) => {
        const packedCount = catItems.filter(i => i.isPacked).length;
        return (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-serif font-semibold text-foreground">{category}</h3>
              <Badge className="bg-muted text-muted-foreground border-0 font-sans text-xs">
                {packedCount}/{catItems.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {catItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    item.isPacked
                      ? "bg-muted/50 border-border opacity-60"
                      : "bg-card border-border hover:border-secondary/30"
                  }`}
                >
                  <button
                    onClick={() => toggleItem.mutate({ id: item.id, isPacked: !item.isPacked })}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors min-w-[24px] min-h-[44px] ${
                      item.isPacked
                        ? "bg-secondary border-secondary"
                        : "border-border hover:border-secondary"
                    }`}
                  >
                    {item.isPacked && <CheckSquare className="w-3.5 h-3.5 text-secondary-foreground" />}
                  </button>
                  <span className={`flex-1 font-sans text-sm ${item.isPacked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.item}
                    {item.quantity && item.quantity > 1 && (
                      <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                    )}
                  </span>
                  {item.notes && (
                    <span className="text-muted-foreground font-sans text-xs italic">{item.notes}</span>
                  )}
                  <button
                    onClick={() => deleteItem.mutate({ id: item.id })}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </PortalLayout>
  );
}
