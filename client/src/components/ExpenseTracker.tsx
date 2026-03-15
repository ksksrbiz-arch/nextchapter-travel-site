import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Camera,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  FileText,
  Zap,
  Plus,
  X,
  Check,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getReceiptOCRService,
  ExtractedExpense,
} from "../_core/services/receiptOCR";

const CATEGORY_CONFIG = {
  food: {
    emoji: "🍽️",
    label: "Food & Dining",
    color: "bg-orange-500/10 text-orange-700",
  },
  transport: {
    emoji: "🚗",
    label: "Transport",
    color: "bg-blue-500/10 text-blue-700",
  },
  accommodation: {
    emoji: "🏨",
    label: "Accommodation",
    color: "bg-purple-500/10 text-purple-700",
  },
  activity: {
    emoji: "🎯",
    label: "Activities",
    color: "bg-emerald-500/10 text-emerald-700",
  },
  shopping: {
    emoji: "🛍️",
    label: "Shopping",
    color: "bg-pink-500/10 text-pink-700",
  },
  entertainment: {
    emoji: "🎉",
    label: "Entertainment",
    color: "bg-red-500/10 text-red-700",
  },
  other: { emoji: "📌", label: "Other", color: "bg-gray-500/10 text-gray-700" },
};

interface ExpenseTrackerProps {
  tripId: string;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ tripId }) => {
  const [expenses, setExpenses] = useState<ExtractedExpense[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ExtractedExpense>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const ocrService = useRef(getReceiptOCRService());

  useEffect(() => {
    // Load expenses for this trip
    const tripExpenses = ocrService.current.getExpensesByTrip(tripId);
    setExpenses(tripExpenses);
  }, [tripId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Mock file reading - in production, send to backend for OCR
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await ocrService.current.processReceipt({
          id: `receipt-${Date.now()}`,
          url: reader.result as string,
          timestamp: Date.now(),
          tripId,
        });

        if (result) {
          setExpenses(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await ocrService.current.processReceipt({
          id: `receipt-${Date.now()}`,
          url: reader.result as string,
          timestamp: Date.now(),
          tripId,
        });

        if (result) {
          setExpenses(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    ocrService.current.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleEditStart = (expense: ExtractedExpense) => {
    setEditingId(expense.id);
    setEditData(expense);
  };

  const handleEditSave = (id: string) => {
    const updated = ocrService.current.updateExpense(id, editData);
    if (updated) {
      setExpenses(prev => prev.map(e => (e.id === id ? updated : e)));
      setEditingId(null);
    }
  };

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    count: expenses.length,
    average:
      expenses.length > 0
        ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length
        : 0,
    highest: expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0,
  };

  const categoryTotals = Object.keys(CATEGORY_CONFIG).reduce(
    (acc, cat) => {
      acc[cat] = expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-dashed border-2 border-blue-500/30 bg-blue-500/5">
          <div className="flex flex-col items-center justify-center gap-4">
            <Upload className="w-8 h-8 text-blue-600" />
            <div className="text-center">
              <h3 className="font-semibold mb-1">Upload Receipt</h3>
              <p className="text-sm text-muted-foreground">JPG, PNG, or PDF</p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Choose File"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>

        <Card className="p-6 border-dashed border-2 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex flex-col items-center justify-center gap-4">
            <Camera className="w-8 h-8 text-emerald-600" />
            <div className="text-center">
              <h3 className="font-semibold mb-1">Take Photo</h3>
              <p className="text-sm text-muted-foreground">
                Capture with camera
              </p>
            </div>
            <Button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Processing..." : "Open Camera"}
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </div>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-emerald-600">
            ${stats.total.toFixed(2)}
          </div>
        </Card>
        <Card className="p-4 border-blue-500/20 bg-blue-500/5">
          <div className="text-sm text-muted-foreground mb-1">Expenses</div>
          <div className="text-2xl font-bold text-blue-600">{stats.count}</div>
        </Card>
        <Card className="p-4 border-purple-500/20 bg-purple-500/5">
          <div className="text-sm text-muted-foreground mb-1">Average</div>
          <div className="text-2xl font-bold text-purple-600">
            ${stats.average.toFixed(2)}
          </div>
        </Card>
        <Card className="p-4 border-orange-500/20 bg-orange-500/5">
          <div className="text-sm text-muted-foreground mb-1">Highest</div>
          <div className="text-2xl font-bold text-orange-600">
            ${stats.highest.toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Spending by Category
        </h3>
        <div className="space-y-3">
          {Object.entries(categoryTotals)
            .filter(([_, amount]) => amount > 0)
            .sort(([_, a], [__, b]) => b - a)
            .map(([category, amount]) => {
              const config =
                CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
              const percentage = (amount / stats.total) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{config.emoji}</span>
                      <span className="text-sm font-medium">
                        {config.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${amount.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* Expense List */}
      {expenses.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">All Expenses</h3>
          {[...expenses]
            .sort((a, b) => b.date - a.date)
            .map(expense => {
              const config = CATEGORY_CONFIG[expense.category];
              const isEditing = editingId === expense.id;

              return (
                <Card key={expense.id} className="p-4 border-border/50">
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editData.vendor || ""}
                          onChange={e =>
                            setEditData({ ...editData, vendor: e.target.value })
                          }
                          className="flex-1 px-3 py-2 bg-black/20 border border-border/50 rounded text-sm"
                          placeholder="Vendor"
                        />
                        <input
                          type="number"
                          value={editData.amount || ""}
                          onChange={e =>
                            setEditData({
                              ...editData,
                              amount: parseFloat(e.target.value),
                            })
                          }
                          className="w-24 px-3 py-2 bg-black/20 border border-border/50 rounded text-sm"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(expense.id)}
                          className="flex-1 bg-emerald-600"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{config.emoji}</span>
                          <h4 className="font-semibold">{expense.vendor}</h4>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {Math.round(expense.confidence * 100)}% confidence
                          </span>
                        </div>
                        {expense.items && expense.items.length > 0 && (
                          <div className="text-xs text-muted-foreground/70 mt-1">
                            {expense.items.join(" • ")}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ${expense.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {expense.currency}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditStart(expense)}
                            className="p-2 hover:bg-blue-500/10 rounded transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 hover:bg-red-500/10 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {/* Empty State */}
      {expenses.length === 0 && !isProcessing && (
        <Card className="p-12 text-center border-dashed">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold mb-2">No Expenses Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload or take a photo of your receipts to start tracking expenses
          </p>
        </Card>
      )}
    </div>
  );
};

export default ExpenseTracker;
