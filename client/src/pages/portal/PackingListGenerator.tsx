import { useState } from "react";
import {
  Backpack,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Package,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface PackingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  packed: boolean;
  weight?: number;
  notes?: string;
  essential: boolean;
}

interface PackingList {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  items: PackingItem[];
  weather: string;
  duration: number;
  createdAt: string;
}

const CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Shoes",
  "Accessories",
  "Activities",
  "Health",
];

const SUGGESTED_ITEMS: Record<
  string,
  { name: string; category: string; essential: boolean; quantity: number }[]
> = {
  warm: [
    { name: "Warm coat", category: "Clothing", essential: true, quantity: 1 },
    {
      name: "Thermal layers",
      category: "Clothing",
      essential: true,
      quantity: 2,
    },
    { name: "Warm hat", category: "Accessories", essential: true, quantity: 1 },
    { name: "Gloves", category: "Accessories", essential: true, quantity: 1 },
    { name: "Scarf", category: "Accessories", essential: true, quantity: 1 },
    { name: "Wool socks", category: "Clothing", essential: true, quantity: 5 },
    { name: "Boots", category: "Shoes", essential: true, quantity: 1 },
  ],
  tropical: [
    {
      name: "Lightweight clothing",
      category: "Clothing",
      essential: true,
      quantity: 7,
    },
    { name: "Shorts", category: "Clothing", essential: true, quantity: 3 },
    { name: "Sandals", category: "Shoes", essential: true, quantity: 1 },
    {
      name: "Swimming suit",
      category: "Clothing",
      essential: true,
      quantity: 2,
    },
    { name: "Sunscreen", category: "Toiletries", essential: true, quantity: 1 },
    {
      name: "Sunglasses",
      category: "Accessories",
      essential: true,
      quantity: 1,
    },
    { name: "Hat/Cap", category: "Accessories", essential: true, quantity: 1 },
  ],
  base: [
    { name: "Underwear", category: "Clothing", essential: true, quantity: 7 },
    { name: "Socks", category: "Clothing", essential: true, quantity: 5 },
    { name: "T-shirts", category: "Clothing", essential: true, quantity: 4 },
    { name: "Jeans/pants", category: "Clothing", essential: true, quantity: 2 },
    {
      name: "Comfortable shoes",
      category: "Shoes",
      essential: true,
      quantity: 1,
    },
    {
      name: "Toiletries kit",
      category: "Toiletries",
      essential: true,
      quantity: 1,
    },
    {
      name: "Phone charger",
      category: "Electronics",
      essential: true,
      quantity: 1,
    },
    {
      name: "Passport/ID",
      category: "Documents",
      essential: true,
      quantity: 1,
    },
    {
      name: "Travel insurance",
      category: "Documents",
      essential: true,
      quantity: 1,
    },
    {
      name: "Credit card",
      category: "Documents",
      essential: true,
      quantity: 1,
    },
  ],
};

export function PackingListGenerator() {
  const [lists, setLists] = useState<PackingList[]>([
    {
      id: "1",
      tripName: "Hawaii Vacation",
      destination: "Honolulu",
      startDate: "2024-06-15",
      endDate: "2024-06-22",
      weather: "tropical",
      duration: 7,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: "1",
          name: "Lightweight shirts",
          category: "Clothing",
          quantity: 5,
          packed: true,
          essential: true,
        },
        {
          id: "2",
          name: "Shorts",
          category: "Clothing",
          quantity: 3,
          packed: true,
          essential: true,
        },
        {
          id: "3",
          name: "Swimming suit",
          category: "Clothing",
          quantity: 2,
          packed: false,
          essential: true,
        },
        {
          id: "4",
          name: "Sunscreen SPF 50",
          category: "Toiletries",
          quantity: 1,
          packed: false,
          essential: true,
        },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    weather: "warm",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newItemData, setNewItemData] = useState({
    name: "",
    category: "Clothing",
    quantity: "1",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tripName.trim()) newErrors.tripName = "Trip name required";
    if (!formData.destination) newErrors.destination = "Destination required";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const handleCreateList = () => {
    if (!validateForm()) return;

    const duration = calculateDuration(formData.startDate, formData.endDate);
    const suggestedItems = [
      ...SUGGESTED_ITEMS.base,
      ...(formData.weather === "warm" ? SUGGESTED_ITEMS.warm : []),
      ...(formData.weather === "tropical" ? SUGGESTED_ITEMS.tropical : []),
    ];

    const items: PackingItem[] = suggestedItems.map((item, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      packed: false,
      essential: item.essential,
    }));

    const newList: PackingList = {
      id: Date.now().toString(),
      tripName: formData.tripName,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      weather: formData.weather,
      duration: duration,
      createdAt: new Date().toISOString(),
      items,
    };

    setLists([newList, ...lists]);
    setFormData({
      tripName: "",
      destination: "",
      startDate: "",
      endDate: "",
      weather: "warm",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleAddItem = (listId: string) => {
    if (!newItemData.name.trim()) return;

    setLists(
      lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items,
              {
                id: Date.now().toString(),
                name: newItemData.name,
                category: newItemData.category,
                quantity: parseInt(newItemData.quantity) || 1,
                packed: false,
                essential: false,
              },
            ],
          };
        }
        return list;
      })
    );

    setNewItemData({ name: "", category: "Clothing", quantity: "1" });
  };

  const handleTogglePacked = (listId: string, itemId: string) => {
    setLists(
      lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, packed: !item.packed } : item
            ),
          };
        }
        return list;
      })
    );
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    setLists(
      lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter(item => item.id !== itemId),
          };
        }
        return list;
      })
    );
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(l => l.id !== listId));
    setSelectedList(null);
  };

  const currentList = lists.find(l => l.id === selectedList);
  const packedCount = currentList
    ? currentList.items.filter(item => item.packed).length
    : 0;
  const totalCount = currentList ? currentList.items.length : 0;
  const packedWeight = currentList
    ? currentList.items
        .filter(item => item.packed && item.weight)
        .reduce((sum, item) => sum + (item.weight || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Show Lists or Detail */}
      {!selectedList ? (
        <>
          {/* Add List Button */}
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create New Packing List
            </Button>
          )}

          {/* Create List Form */}
          {showForm && (
            <Card className="p-6 border-border/50">
              <h3 className="text-lg font-semibold mb-4">New Packing List</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormFieldWrapper error={errors.tripName}>
                    <input
                      type="text"
                      placeholder="Trip Name"
                      value={formData.tripName}
                      onChange={e => {
                        setFormData({ ...formData, tripName: e.target.value });
                        setErrors({ ...errors, tripName: "" });
                      }}
                      className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper error={errors.destination}>
                    <input
                      type="text"
                      placeholder="Destination"
                      value={formData.destination}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        });
                        setErrors({ ...errors, destination: "" });
                      }}
                      className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </FormFieldWrapper>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormFieldWrapper error={errors.startDate}>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => {
                        setFormData({ ...formData, startDate: e.target.value });
                        setErrors({ ...errors, startDate: "" });
                      }}
                      className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper error={errors.endDate}>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={e => {
                        setFormData({ ...formData, endDate: e.target.value });
                        setErrors({ ...errors, endDate: "" });
                      }}
                      className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </FormFieldWrapper>
                </div>

                <select
                  value={formData.weather}
                  onChange={e =>
                    setFormData({ ...formData, weather: e.target.value })
                  }
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="warm">Warm Weather</option>
                  <option value="tropical">Tropical Region</option>
                  <option value="standard">Standard Climate</option>
                </select>

                <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg flex gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    We'll suggest items based on weather and trip length. You
                    can add or remove them.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCreateList} className="flex-1">
                    Create List
                  </Button>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Lists Overview */}
          {lists.length > 0 ? (
            <div className="space-y-3">
              {lists.map(list => {
                const packed = list.items.filter(item => item.packed).length;
                const total = list.items.length;
                const progress = total > 0 ? (packed / total) * 100 : 0;

                return (
                  <Card
                    key={list.id}
                    className="p-4 border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        onClick={() => setSelectedList(list.id)}
                        className="flex-1"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Backpack className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">
                            {list.tripName}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {list.destination}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {list.startDate} to {list.endDate} • {list.duration}{" "}
                          days
                        </p>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteList(list.id);
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Packing Progress
                        </span>
                        <span className="font-semibold text-foreground">
                          {packed}/{total}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            !showForm && (
              <EmptyState
                icon={Backpack}
                title="No Packing Lists"
                description="Create a packing list for your upcoming trip"
                action={{
                  label: "Create List",
                  onClick: () => setShowForm(true),
                }}
              />
            )
          )}
        </>
      ) : (
        // Packing List Detail View
        <>
          {currentList && (
            <div className="space-y-4">
              {/* Header with Back Button */}
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedList(null)}
                    className="text-primary hover:text-primary/80 text-sm mb-2"
                  >
                    ← Back to Lists
                  </button>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentList.tripName}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentList.destination}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-purple-950/30 to-indigo-950/30 border-purple-500/20 p-6">
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalCount}
                    </p>
                  </div>

                  <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
                    <p className="text-xs text-emerald-300">Packed</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {packedCount}
                    </p>
                  </div>

                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalCount - packedCount}
                    </p>
                  </div>

                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalCount > 0
                        ? Math.round((packedCount / totalCount) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </Card>

              {/* Add Item Form */}
              <Card className="p-4 border-border/50">
                <h3 className="text-sm font-semibold mb-3">Add Item</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Item name..."
                    value={newItemData.name}
                    onChange={e =>
                      setNewItemData({ ...newItemData, name: e.target.value })
                    }
                    className="flex-1 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />

                  <select
                    value={newItemData.category}
                    onChange={e =>
                      setNewItemData({
                        ...newItemData,
                        category: e.target.value,
                      })
                    }
                    className="w-32 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={newItemData.quantity}
                    onChange={e =>
                      setNewItemData({
                        ...newItemData,
                        quantity: e.target.value,
                      })
                    }
                    className="w-16 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />

                  <Button
                    onClick={() => handleAddItem(currentList.id)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Items by Category */}
              <div className="space-y-3">
                {CATEGORIES.map(category => {
                  const items = currentList.items.filter(
                    item => item.category === category
                  );
                  if (items.length === 0) return null;

                  const categoryPacked = items.filter(
                    item => item.packed
                  ).length;

                  return (
                    <Card key={category} className="p-4 border-border/50">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {categoryPacked}/{items.length}
                        </span>
                      </h4>

                      <div className="space-y-2">
                        {items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 hover:bg-black/20 rounded-lg transition-colors"
                          >
                            <button
                              onClick={() =>
                                handleTogglePacked(currentList.id, item.id)
                              }
                              className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                            >
                              {item.packed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>

                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  item.packed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                                {item.weight && ` • ${item.weight}kg`}
                              </p>
                            </div>

                            {item.essential && (
                              <Badge className="text-xs">Essential</Badge>
                            )}

                            <button
                              onClick={() =>
                                handleDeleteItem(currentList.id, item.id)
                              }
                              className="p-1 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Tips Section */}
              <Card className="p-4 border-amber-500/20 bg-amber-950/10">
                <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Packing Tips
                </h4>
                <ul className="text-sm text-amber-200/80 space-y-1">
                  <li>
                    • Lay out items before packing to avoid forgetting anything
                  </li>
                  <li>• Roll clothes to save space</li>
                  <li>• Put heavier items at the bottom</li>
                  <li>• Use packing cubes to organize by category</li>
                  <li>• Keep medications in original bottles</li>
                </ul>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
