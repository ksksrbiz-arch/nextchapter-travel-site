import { useState } from "react";
import { DollarSign, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FormFieldError,
  FormFieldSuccess,
  FormFieldWrapper,
} from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  currency: string;
}

const CATEGORIES = [
  "Flights",
  "Accommodation",
  "Food",
  "Activities",
  "Transportation",
  "Shopping",
  "Other",
];

export function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(5000);
  const [formData, setFormData] = useState({
    category: "Other",
    description: "",
    amount: "",
    currency: "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;
  const percentageUsed = (totalSpent / budget) * 100;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim())
      newErrors.description = "Description required";
    if (!formData.amount || isNaN(parseFloat(formData.amount)))
      newErrors.amount = "Valid amount required";
    if (parseFloat(formData.amount) > 100000)
      newErrors.amount = "Amount too large";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExpense = () => {
    if (!validateForm()) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split("T")[0],
      currency: formData.currency,
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      category: "Other",
      description: "",
      amount: "",
      currency: "USD",
    });
    setErrors({});
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleBudgetChange = (newBudget: string) => {
    const amount = parseFloat(newBudget);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount);
    }
  };

  const categoryExpenses = CATEGORIES.map(cat => ({
    category: cat,
    amount: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card className="bg-gradient-to-br from-emerald-950/30 to-teal-950/30 border-emerald-500/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Budget
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                ${budget.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/60" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-semibold text-foreground">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span
              className={remaining >= 0 ? "text-emerald-500" : "text-red-500"}
            >
              ${remaining.toFixed(2)} Remaining
            </span>
            <span className="text-muted-foreground">
              {percentageUsed.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Budget Input */}
        <input
          type="number"
          min="0"
          step="100"
          value={budget}
          onChange={e => handleBudgetChange(e.target.value)}
          className="w-full bg-black/20 border border-emerald-500/30 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60"
          placeholder="Set budget"
        />
      </Card>

      {/* Add Expense Form */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Expense
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <select
              value={formData.category}
              onChange={e =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <FormFieldWrapper error={errors.description}>
            <input
              type="text"
              placeholder="e.g., Flight to Hawaii"
              value={formData.description}
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FormFieldWrapper error={errors.amount}>
              <input
                type="number"
                placeholder="Amount"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={e => {
                  setFormData({ ...formData, amount: e.target.value });
                  setErrors({ ...errors, amount: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <select
              value={formData.currency}
              onChange={e =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>CAD</option>
              <option>AUD</option>
            </select>
          </div>

          <Button onClick={handleAddExpense} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </Card>

      {/* Category Breakdown */}
      {expenses.length > 0 && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryExpenses.map(
              cat =>
                cat.amount > 0 && (
                  <div
                    key={cat.category}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-black/20 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(cat.amount / totalSpent) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-fit">
                        ${cat.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </Card>
      )}

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
          <div className="space-y-2">
            {expenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {expense.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {expense.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground min-w-fit">
                    ${expense.amount.toFixed(2)} {expense.currency}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={DollarSign}
          title="No Expenses Yet"
          description="Start tracking your trip expenses to stay within budget"
          action={{ label: "Add First Expense", onClick: () => {} }}
        />
      )}
    </div>
  );
}
