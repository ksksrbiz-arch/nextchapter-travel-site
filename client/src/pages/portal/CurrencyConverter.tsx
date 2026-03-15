import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ArrowRightLeft,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExchangeRate {
  pair: string;
  rate: number;
  change: number;
}

const MOCK_RATES: ExchangeRate[] = [
  { pair: "USD to EUR", rate: 0.92, change: 0.5 },
  { pair: "USD to GBP", rate: 0.79, change: -0.3 },
  { pair: "USD to CAD", rate: 1.36, change: 0.2 },
  { pair: "USD to AUD", rate: 1.53, change: 1.2 },
  { pair: "USD to JPY", rate: 149.5, change: -0.8 },
  { pair: "USD to MXN", rate: 17.05, change: 0.1 },
];

export function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [favorite, setFavorite] = useState(false);

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "JPY",
    "MXN",
    "CHF",
    "CNY",
    "INR",
  ];

  // Mock conversion - in real app would use API
  const getRate = (from: string, to: string): number => {
    const mockRates: Record<string, Record<string, number>> = {
      USD: {
        EUR: 0.92,
        GBP: 0.79,
        CAD: 1.36,
        AUD: 1.53,
        JPY: 149.5,
        MXN: 17.05,
        CHF: 0.88,
        CNY: 7.2,
        INR: 83.1,
      },
      EUR: {
        USD: 1.09,
        GBP: 0.86,
        CAD: 1.48,
        AUD: 1.66,
        JPY: 162.9,
        MXN: 18.54,
        CHF: 0.96,
        CNY: 7.83,
        INR: 90.4,
      },
      GBP: {
        USD: 1.27,
        EUR: 1.16,
        CAD: 1.72,
        AUD: 1.94,
        JPY: 189.4,
        MXN: 21.58,
        CHF: 1.11,
        CNY: 9.11,
        INR: 105.1,
      },
    };
    return mockRates[from]?.[to] || 1;
  };

  const rate = getRate(fromCurrency, toCurrency);
  const convertedAmount = (parseFloat(amount) || 0) * rate;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-6">
      {/* Converter */}
      <Card className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border-indigo-500/20 p-6">
        <h3 className="text-lg font-semibold mb-6">Currency Converter</h3>

        {/* From Currency */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            From
          </label>
          <div className="space-y-2">
            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {currencies.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={swapCurrencies}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors border border-border/50"
          >
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* To Currency */}
        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            To
          </label>
          <div className="space-y-2">
            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {currencies.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground">
              {convertedAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="p-4 bg-black/20 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </span>
            <Badge variant="outline" className="text-xs gap-1">
              <RefreshCw className="w-3 h-3" />
              Live rates
            </Badge>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {amount || "0"} {fromCurrency} = {convertedAmount.toFixed(2)}{" "}
            {toCurrency}
          </div>
        </div>

        {/* Save as Favorite */}
        <button
          onClick={() => setFavorite(!favorite)}
          className={`w-full py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
            favorite
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-border/80 text-muted-foreground"
          }`}
        >
          {favorite ? "★" : "☆"} Save as Favorite
        </button>
      </Card>

      {/* Exchange Rates */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Live Exchange Rates (vs USD)
        </h3>

        <div className="space-y-2">
          {MOCK_RATES.map(rate => (
            <div
              key={rate.pair}
              className="p-3 bg-black/20 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {rate.pair}
                </p>
                <p className="text-xs text-muted-foreground">
                  1 USD = {rate.rate}
                </p>
              </div>
              <div
                className={`text-sm font-semibold ${rate.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {rate.change >= 0 ? "+" : ""}
                {rate.change}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversion Tips */}
      <Card className="border-blue-500/20 bg-blue-950/20 p-4">
        <h4 className="font-medium text-sm text-blue-400 mb-3">
          💡 Money-Saving Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Exchange money before traveling for better rates</li>
          <li>• Avoid airport exchanges - rates are typically higher</li>
          <li>• Notify your bank of international travel dates</li>
          <li>• Credit cards often have better rates than cash exchange</li>
          <li>• Watch for hidden fees on ATM withdrawals abroad</li>
        </ul>
      </Card>
    </div>
  );
}
