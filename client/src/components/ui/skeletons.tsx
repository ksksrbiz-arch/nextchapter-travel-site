/**
 * Skeleton/loading state components for portal pages
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Trip countdown section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 h-32" />

      {/* Alerts banner */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-16" />

      {/* Quick links grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"
          />
        ))}
      </div>

      {/* Trips list */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-20"
          />
        ))}
      </div>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ItinerarySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Trip header */}
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 mb-6" />

      {/* Day sections */}
      {[...Array(3)].map((_, dayIdx) => (
        <div key={dayIdx} className="space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          {[...Array(2)].map((_, itemIdx) => (
            <div
              key={itemIdx}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function DocumentsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Upload area skeleton */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-24" />

      {/* Document categories */}
      {[...Array(3)].map((_, categoryIdx) => (
        <div key={categoryIdx} className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            {[...Array(2)].map((_, docIdx) => (
              <div
                key={docIdx}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg h-16"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-20"
          />
        ))}
      </div>

      {/* Booking list */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-24"
          />
        ))}
      </div>
    </div>
  );
}

export function GuidesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search bar */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
          />
        ))}
      </div>

      {/* Guide grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-40"
          />
        ))}
      </div>
    </div>
  );
}

export function AlertsSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
          />
        ))}
      </div>

      {/* Alert items */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-16" />
      ))}
    </div>
  );
}

export function PackingListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Add item button */}
      <div className="h-10 bg-blue-200 dark:bg-blue-900 rounded-lg w-32" />

      {/* Packing categories */}
      {[...Array(3)].map((_, categoryIdx) => (
        <div key={categoryIdx} className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, itemIdx) => (
              <div
                key={itemIdx}
                className="bg-gray-100 dark:bg-gray-800 rounded h-12"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Generic skeleton that can be used for any loading state
 */
export function GenericSkeleton({
  lines = 5,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${Math.random() * 20 + 80}%` }}
        />
      ))}
    </div>
  );
}
