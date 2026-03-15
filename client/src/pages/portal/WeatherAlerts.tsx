import { useState } from "react";
import { Cloud, AlertTriangle, Eye, Wind, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WeatherForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  icon: string;
}

interface Alert {
  id: string;
  type: "warning" | "alert" | "advisory";
  title: string;
  description: string;
  date: string;
}

const MOCK_WEATHER: WeatherForecast[] = [
  {
    day: "Monday",
    date: "Mar 15",
    high: 78,
    low: 68,
    condition: "Sunny",
    precipitation: 0,
    windSpeed: 8,
    icon: "☀️",
  },
  {
    day: "Tuesday",
    date: "Mar 16",
    high: 76,
    low: 66,
    condition: "Partly Cloudy",
    precipitation: 10,
    windSpeed: 10,
    icon: "⛅",
  },
  {
    day: "Wednesday",
    date: "Mar 17",
    high: 72,
    low: 62,
    condition: "Rainy",
    precipitation: 60,
    windSpeed: 15,
    icon: "🌧️",
  },
  {
    day: "Thursday",
    date: "Mar 18",
    high: 75,
    low: 65,
    condition: "Partly Cloudy",
    precipitation: 20,
    windSpeed: 12,
    icon: "⛅",
  },
  {
    day: "Friday",
    date: "Mar 19",
    high: 79,
    low: 69,
    condition: "Sunny",
    precipitation: 5,
    windSpeed: 7,
    icon: "☀️",
  },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "advisory",
    title: "High Pollen Count",
    description:
      "Tree pollen levels are elevated. Bring allergy medication if needed.",
    date: "2024-03-12",
  },
  {
    id: "2",
    type: "warning",
    title: "Strong Wind Advisory",
    description:
      "Wind gusts up to 25 mph expected Wednesday. Secure outdoor plans.",
    date: "2024-03-12",
  },
];

export function WeatherAlerts() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set()
  );

  const dismiss = (id: string) => {
    const newSet = new Set(dismissedAlerts);
    newSet.add(id);
    setDismissedAlerts(newSet);
  };

  const activeAlerts = MOCK_ALERTS.filter(a => !dismissedAlerts.has(a.id));
  const selectedForecast = MOCK_WEATHER[selectedDay];

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.map(alert => (
            <Card
              key={alert.id}
              className={`p-4 border-l-4 ${
                alert.type === "warning"
                  ? "border-l-red-500 bg-red-950/20 border-red-500/20"
                  : alert.type === "alert"
                    ? "border-l-orange-500 bg-orange-950/20 border-orange-500/20"
                    : "border-l-yellow-500 bg-yellow-950/20 border-yellow-500/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.type === "warning"
                        ? "text-red-500"
                        : alert.type === "alert"
                          ? "text-orange-500"
                          : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <h4 className="font-medium text-sm text-foreground mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismiss(alert.id)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 5-Day Forecast Tabs */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {MOCK_WEATHER.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all text-center ${
                selectedDay === idx
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground">
                {day.day}
              </div>
              <div className="text-2xl my-2">{day.icon}</div>
              <div className="text-sm font-semibold text-foreground">
                {day.date}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Day Details */}
      <Card className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-500/20 p-6">
        <h4 className="text-lg font-semibold mb-4">
          {selectedForecast.day}'s Forecast
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-black/20 rounded-lg">
            <div className="text-4xl mb-2">{selectedForecast.icon}</div>
            <p className="text-sm text-muted-foreground">
              {selectedForecast.condition}
            </p>
          </div>

          <div>
            <div className="mb-3">
              <span className="text-xs text-muted-foreground">High/Low</span>
              <p className="text-2xl font-bold text-foreground">
                {selectedForecast.high}° / {selectedForecast.low}°F
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Feels like {Math.round(selectedForecast.high - 2)}°F
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Chance Rain</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {selectedForecast.precipitation}%
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Wind Speed</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {selectedForecast.windSpeed} mph
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Visibility</span>
            </div>
            <p className="text-lg font-semibold text-foreground">10 mi</p>
          </div>
        </div>

        {/* Packing Suggestion */}
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Suggested Items:</p>
          <div className="flex flex-wrap gap-2">
            {selectedForecast.precipitation > 30 && (
              <Badge variant="outline" className="text-xs">
                ☔ Umbrella
              </Badge>
            )}
            {selectedForecast.high > 75 && (
              <Badge variant="outline" className="text-xs">
                😎 Sunscreen
              </Badge>
            )}
            {selectedForecast.windSpeed > 12 && (
              <Badge variant="outline" className="text-xs">
                🧥 Windbreaker
              </Badge>
            )}
            {selectedForecast.high < 60 && (
              <Badge variant="outline" className="text-xs">
                🧣 Jacket
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Packing Reminders */}
      <Card className="bg-emerald-950/20 border-emerald-500/20 p-4">
        <h4 className="font-medium text-sm text-emerald-400 mb-2">
          💡 Pro Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Layers work best for variable weather</li>
          <li>• Bring rain gear regardless of forecast</li>
          <li>• Check weather again 3 days before travel</li>
        </ul>
      </Card>
    </div>
  );
}
