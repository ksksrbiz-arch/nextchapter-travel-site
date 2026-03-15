type StatusClass = "2xx" | "3xx" | "4xx" | "5xx" | "other";

type HistogramBucket = {
  le: number;
  count: number;
};

type MetricsSnapshot = {
  uptimeMs: number;
  requests: {
    total: number;
    byStatus: Record<StatusClass, number>;
  };
  latencyMs: {
    buckets: HistogramBucket[];
    sum: number;
  };
};

const startedAt = Date.now();
const statusBuckets: Record<StatusClass, number> = {
  "2xx": 0,
  "3xx": 0,
  "4xx": 0,
  "5xx": 0,
  other: 0,
};
const latencyBuckets: HistogramBucket[] = [
  { le: 50, count: 0 },
  { le: 100, count: 0 },
  { le: 250, count: 0 },
  { le: 500, count: 0 },
  { le: 1000, count: 0 },
  { le: 2000, count: 0 },
  { le: 5000, count: 0 },
  { le: Number.POSITIVE_INFINITY, count: 0 },
];

let totalRequests = 0;
let latencySum = 0;

function classifyStatus(status: number): StatusClass {
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 300 && status < 400) return "3xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500 && status < 600) return "5xx";
  return "other";
}

function bucketLatency(durationMs: number): void {
  for (const bucket of latencyBuckets) {
    if (durationMs <= bucket.le) {
      bucket.count += 1;
      return;
    }
  }
}

export function recordRequest(status: number, durationMs: number): void {
  const statusClass = classifyStatus(status);
  statusBuckets[statusClass] += 1;
  totalRequests += 1;
  latencySum += durationMs;
  bucketLatency(durationMs);
}

export function getMetricsSnapshot(): MetricsSnapshot {
  return {
    uptimeMs: Date.now() - startedAt,
    requests: {
      total: totalRequests,
      byStatus: { ...statusBuckets },
    },
    latencyMs: {
      buckets: latencyBuckets.map(b => ({ ...b })),
      sum: latencySum,
    },
  };
}

export function renderPrometheus(): string {
  const lines: string[] = [];
  const snapshot = getMetricsSnapshot();

  lines.push("# HELP app_uptime_ms Process uptime in milliseconds");
  lines.push("# TYPE app_uptime_ms gauge");
  lines.push(`app_uptime_ms ${snapshot.uptimeMs}`);

  lines.push("# HELP app_requests_total Total HTTP requests");
  lines.push("# TYPE app_requests_total counter");
  lines.push(`app_requests_total ${snapshot.requests.total}`);

  lines.push(
    "# HELP app_requests_status_class_total HTTP requests by status class"
  );
  lines.push("# TYPE app_requests_status_class_total counter");
  for (const [cls, count] of Object.entries(snapshot.requests.byStatus)) {
    lines.push(`app_requests_status_class_total{class="${cls}"} ${count}`);
  }

  lines.push(
    "# HELP app_request_latency_ms Histogram of request durations in ms"
  );
  lines.push("# TYPE app_request_latency_ms histogram");
  let cumulative = 0;
  for (const bucket of snapshot.latencyMs.buckets) {
    cumulative += bucket.count;
    lines.push(
      `app_request_latency_ms_bucket{le="${bucket.le}"} ${cumulative}`
    );
  }
  lines.push(`app_request_latency_ms_sum ${snapshot.latencyMs.sum}`);
  lines.push(`app_request_latency_ms_count ${snapshot.requests.total}`);

  return lines.join("\n") + "\n";
}
