import { useState } from "react";
import {
  DollarSign,
  Trash2,
  TrendingUp,
  Calculator,
  ArrowRightLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface CurrencySimulation {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  baseAmount: number;
  exchangeRate: number;
  convertedAmount: number;
  timestamp: string;
  notes?: string;
  isFavorite: boolean;
}

interface CurrencyPair {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

const CURRENCIES: CurrencyPair[] = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "Americas" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "Americas" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", region: "Europe" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", region: "Americas" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "Asia" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "Oceania" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
  { code: "THB", name: "Thai Baht", symbol: "฿", region: "Asia" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "Americas" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", region: "Middle East" },
];

// Simplified exchange rates (in real app, this would be fetched from API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.1,
    MXN: 17.05,
    SGD: 1.34,
    HKD: 7.81,
    NZD: 1.62,
    SEK: 10.32,
    THB: 35.2,
    BRL: 4.97,
    ZAR: 18.75,
    AED: 3.67,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 163.2,
    AUD: 1.66,
    CAD: 1.48,
    CHF: 0.96,
    CNY: 7.87,
    INR: 90.3,
    MXN: 18.54,
    SGD: 1.46,
    HKD: 8.49,
    NZD: 1.76,
    SEK: 11.22,
    THB: 38.3,
    BRL: 5.4,
    ZAR: 20.38,
    AED: 3.99,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    JPY: 189.9,
    AUD: 1.93,
    CAD: 1.72,
    CHF: 1.12,
    CNY: 9.15,
    INR: 105.0,
    MXN: 21.56,
    SGD: 1.7,
    HKD: 9.88,
    NZD: 2.05,
    SEK: 13.05,
    THB: 44.57,
    BRL: 6.28,
    ZAR: 23.71,
    AED: 4.64,
  },
  JPY: {
    USD: 0.0067,
    EUR: 0.0061,
    GBP: 0.0053,
    AUD: 0.0102,
    CAD: 0.0091,
    CHF: 0.0059,
    CNY: 0.0484,
    INR: 0.556,
    MXN: 0.114,
    SGD: 0.009,
    HKD: 0.0522,
    NZD: 0.0108,
    SEK: 0.069,
    THB: 0.235,
    BRL: 0.033,
    ZAR: 0.125,
    AED: 0.0246,
  },
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.798,
    AUD: 0.0184,
    CAD: 0.0164,
    CHF: 0.0106,
    CNY: 0.087,
    MXN: 0.205,
    SGD: 0.0162,
    HKD: 0.094,
    NZD: 0.0195,
    SEK: 0.124,
    THB: 0.423,
    BRL: 0.0596,
    ZAR: 0.225,
    AED: 0.0442,
  },
  AUD: {
    USD: 0.65,
    EUR: 0.6,
    GBP: 0.52,
    JPY: 97.7,
    CAD: 0.89,
    CHF: 0.58,
    CNY: 4.73,
    INR: 54.3,
    MXN: 11.14,
    SGD: 0.88,
    HKD: 5.1,
    NZD: 1.06,
    SEK: 6.74,
    THB: 23.02,
    BRL: 3.25,
    ZAR: 12.25,
    AED: 2.4,
  },
};

export function LocalCurrencySimulator() {
  const [simulations, setSimulations] = useState<CurrencySimulation[]>([
    {
      id: "1",
      baseCurrency: "USD",
      targetCurrency: "EUR",
      baseAmount: 100,
      exchangeRate: 0.92,
      convertedAmount: 92,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      notes: "Hotel booking in Barcelona",
      isFavorite: true,
    },
    {
      id: "2",
      baseCurrency: "USD",
      targetCurrency: "JPY",
      baseAmount: 500,
      exchangeRate: 149.5,
      convertedAmount: 74750,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Restaurant and activities in Tokyo",
      isFavorite: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    baseCurrency: "USD",
    targetCurrency: "EUR",
    baseAmount: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getExchangeRate = (from: string, to: string): number => {
    if (from === to) return 1;
    return EXCHANGE_RATES[from]?.[to] || 1;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.baseAmount || isNaN(parseFloat(formData.baseAmount))) {
      newErrors.baseAmount = "Valid amount required";
    }
    if (formData.baseCurrency === formData.targetCurrency) {
      newErrors.targetCurrency = "Select different currencies";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSimulation = () => {
    if (!validateForm()) return;

    const rate = getExchangeRate(
      formData.baseCurrency,
      formData.targetCurrency
    );
    const converted = parseFloat(formData.baseAmount) * rate;

    const newSimulation: CurrencySimulation = {
      id: Date.now().toString(),
      baseCurrency: formData.baseCurrency,
      targetCurrency: formData.targetCurrency,
      baseAmount: parseFloat(formData.baseAmount),
      exchangeRate: rate,
      convertedAmount: converted,
      timestamp: new Date().toISOString(),
      notes: formData.notes,
      isFavorite: false,
    };

    setSimulations([newSimulation, ...simulations]);
    setFormData({
      baseCurrency: "USD",
      targetCurrency: "EUR",
      baseAmount: "",
      notes: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteSimulation = (id: string) => {
    setSimulations(simulations.filter(s => s.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setSimulations(
      simulations.map(sim =>
        sim.id === id ? { ...sim, isFavorite: !sim.isFavorite } : sim
      )
    );
  };

  const handleSwapCurrencies = () => {
    setFormData({
      ...formData,
      baseCurrency: formData.targetCurrency,
      targetCurrency: formData.baseCurrency,
    });
  };

  const baseCurrencyInfo = CURRENCIES.find(
    c => c.code === formData.baseCurrency
  );
  const targetCurrencyInfo = CURRENCIES.find(
    c => c.code === formData.targetCurrency
  );
  const currentRate = getExchangeRate(
    formData.baseCurrency,
    formData.targetCurrency
  );
  const previewAmount = formData.baseAmount
    ? parseFloat(formData.baseAmount) * currentRate
    : 0;

  const favoriteSimulations = simulations.filter(s => s.isFavorite);
  const otherSimulations = simulations.filter(s => !s.isFavorite);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Currency Converter
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Conversions</p>
            <p className="text-2xl font-bold text-foreground">
              {simulations.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-cyan-500/30">
            <p className="text-xs text-cyan-300">Favorites</p>
            <p className="text-2xl font-bold text-cyan-400">
              {favoriteSimulations.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Rate Updated</p>
            <p className="text-sm font-medium text-foreground">Real-time</p>
          </div>
        </div>
      </Card>

      {/* Add Conversion Form */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">New Conversion</h3>

        <div className="space-y-4">
          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.baseCurrency}
              onChange={e =>
                setFormData({ ...formData, baseCurrency: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {CURRENCIES.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSwapCurrencies}
              className="h-10 flex items-center justify-center bg-black/20 border border-border/50 rounded-lg hover:bg-black/30 transition-colors"
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-4 h-4 text-primary" />
            </button>
          </div>

          <select
            value={formData.targetCurrency}
            onChange={e =>
              setFormData({ ...formData, targetCurrency: e.target.value })
            }
            className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            {CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>

          {/* Amount */}
          <FormFieldWrapper error={errors.baseAmount}>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                {baseCurrencyInfo?.symbol}
              </span>
              <input
                type="number"
                placeholder="Amount"
                value={formData.baseAmount}
                onChange={e => {
                  setFormData({ ...formData, baseAmount: e.target.value });
                  setErrors({ ...errors, baseAmount: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
          </FormFieldWrapper>

          {/* Preview */}
          {formData.baseAmount && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">You will get</p>
                  <p className="text-xl font-bold text-primary">
                    {targetCurrencyInfo?.symbol} {previewAmount.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-lg font-semibold text-foreground">
                    1 {formData.baseCurrency} = {currentRate.toFixed(4)}{" "}
                    {formData.targetCurrency}
                  </p>
                </div>
              </div>
            </div>
          )}

          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            rows={2}
          />

          <Button onClick={handleAddSimulation} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Convert & Save
          </Button>
        </div>
      </Card>

      {/* Favorite Conversions */}
      {favoriteSimulations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Favorite Conversions
          </h3>
          <div className="space-y-3">
            {favoriteSimulations.map(sim => (
              <Card key={sim.id} className="p-4 border-primary/30 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">
                        {sim.baseAmount} {sim.baseCurrency}
                      </span>
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">
                        {sim.convertedAmount.toFixed(2)} {sim.targetCurrency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rate: {sim.exchangeRate.toFixed(4)} •{" "}
                      {sim.notes && `${sim.notes} •`}{" "}
                      {new Date(sim.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(sim.id)}
                    className="p-2 hover:bg-primary/20 rounded-lg transition-colors ml-2"
                  >
                    <DollarSign className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Conversions */}
      {otherSimulations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Recent Conversions
          </h3>
          <div className="space-y-3">
            {otherSimulations.map(sim => (
              <Card key={sim.id} className="p-4 border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {sim.baseAmount} {sim.baseCurrency}
                      </span>
                      <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {sim.convertedAmount.toFixed(2)} {sim.targetCurrency}
                      </span>
                    </div>
                    {sim.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {sim.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Rate: {sim.exchangeRate.toFixed(4)} •{" "}
                      {new Date(sim.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleFavorite(sim.id)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <DollarSign className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>

                    <button
                      onClick={() => handleDeleteSimulation(sim.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {simulations.length === 0 && (
        <EmptyState
          icon={DollarSign}
          title="No Conversions Yet"
          description="Start by converting currencies to compare prices and budgets"
        />
      )}
    </div>
  );
}
