import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useTrip } from "@/contexts/TripContext";
import { toast } from "sonner";
import { Plus, Trash2, CheckSquare, Loader2, Package } from "lucide-react";
import { NoPackingItemsEmptyState } from "@/components/ui/empty-states";
import { PackingListSkeleton } from "@/components/ui/skeletons";

const CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Documents",
  "Electronics",
  "Medications",
  "Entertainment",
  "Beach/Pool",
  "Shoes",
  "Accessories",
  "Snacks",
  "General",
];

export default function PackingList() {
  const { selectedTripId: tripId } = useTrip();

  const {
    data: items,
    isLoading,
    refetch,
  } = trpc.packing.list.useQuery({ tripId: tripId! }, { enabled: !!tripId });

  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [itemError, setItemError] = useState<string | undefined>();

  const createItem = trpc.packing.create.useMutation({
    onSuccess: () => {
      setNewItem("");
      setItemError(undefined);
      refetch();
    },
    onError: e => setItemError(e.message),
  });

  const toggleItem = trpc.packing.toggle.useMutation({
    onSuccess: () => refetch(),
    onError: e => toast.error(e.message),
  });

  const deleteItem = trpc.packing.delete.useMutation({
    onSuccess: () => {
      toast.success("Item removed");
      refetch();
    },
    onError: e => toast.error(e.message),
  });

  const handleAdd = () => {
    const itemName = newItem.trim();

    // Validate input
    if (!itemName) {
      setItemError("Please enter an item name");
      return;
    }

    if (itemName.length < 2) {
      setItemError("Item name must be at least 2 characters");
      return;
    }

    if (itemName.length > 100) {
      setItemError("Item name must not exceed 100 characters");
      return;
    }

    if (!tripId) return;

    setItemError(undefined);
    createItem.mutate({ tripId, item: itemName, category: newCategory });
  };

  const grouped = useMemo(() => {
    if (!items) return {};
    return items.reduce(
      (acc, item) => {
        const cat = item.category ?? "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  }, [items]);

  const totalItems = items?.length ?? 0;
  const packedItems = items?.filter(i => i.isPacked).length ?? 0;
  const progress =
    totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <PortalLayout title="Packing List" subtitle="Never forget a thing">
      {/* Trip selector is in the portal header (TripSwitcher) */}

      {/* Progress bar */}
      {totalItems > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-semibold text-foreground">
              Packing Progress
            </h3>
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
          <h3 className="font-serif font-semibold text-foreground mb-4">
            Add Item
          </h3>
          {itemError && (
            <div className="mb-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {itemError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-full sm:w-44 font-sans flex-shrink-0 min-h-[48px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="font-sans">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newItem}
              onChange={e => {
                setNewItem(e.target.value);
                if (itemError) setItemError(undefined);
              }}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="Add an item..."
              className="flex-1 font-sans min-h-[48px]"
            />
            <Button
              onClick={handleAdd}
              disabled={!newItem.trim() || createItem.isPending}
              className="bg-primary text-primary-foreground font-sans flex-shrink-0 min-h-[48px] w-full sm:w-auto"
            >
              {createItem.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && <PackingListSkeleton />}

      {/* Empty state */}
      {!isLoading && tripId && totalItems === 0 && (
        <NoPackingItemsEmptyState onAdd={() => {}} />
      )}

      {!tripId && !isLoading && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            No Trip Selected
          </h3>
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
              <h3 className="font-serif font-semibold text-foreground">
                {category}
              </h3>
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
                    onClick={() =>
                      toggleItem.mutate({
                        id: item.id,
                        isPacked: !item.isPacked,
                      })
                    }
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors min-w-[24px] min-h-[44px] ${
                      item.isPacked
                        ? "bg-secondary border-secondary"
                        : "border-border hover:border-secondary"
                    }`}
                  >
                    {item.isPacked && (
                      <CheckSquare className="w-3.5 h-3.5 text-secondary-foreground" />
                    )}
                  </button>
                  <span
                    className={`flex-1 font-sans text-sm ${item.isPacked ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {item.item}
                    {item.quantity && item.quantity > 1 && (
                      <span className="text-muted-foreground ml-2">
                        ×{item.quantity}
                      </span>
                    )}
                  </span>
                  {item.notes && (
                    <span className="text-muted-foreground font-sans text-xs italic">
                      {item.notes}
                    </span>
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
