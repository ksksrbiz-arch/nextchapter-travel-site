import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      {illustration ? (
        <div className="mb-6 w-full flex justify-center">{illustration}</div>
      ) : Icon ? (
        <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      ) : null}

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-medium transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface NoResultsProps {
  query?: string;
  className?: string;
}

export function NoResults({ query, className = "" }: NoResultsProps) {
  return (
    <EmptyState
      icon={undefined}
      title="No results found"
      description={
        query
          ? `No items match "${query}". Try a different search term.`
          : "No items found."
      }
      className={className}
    />
  );
}

interface LoadingEmptyStateProps {
  title: string;
  className?: string;
}

export function LoadingEmptyState({
  title,
  className = "",
}: LoadingEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="mb-4 flex gap-2">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
}

// Specific empty states for portal pages

import {
  Calendar,
  MessageSquare,
  FileText,
  BookOpen,
  AlertCircle,
  Luggage,
} from "lucide-react";

export function NoBookingsEmptyState() {
  return (
    <EmptyState
      icon={Calendar}
      title="No bookings yet"
      description="Once you make a booking, it will appear here. Check back soon!"
    />
  );
}

export function NoMessagesEmptyState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No messages"
      description="Your direct messages with guides and trip leaders will appear here."
    />
  );
}

export function NoDocumentsEmptyState() {
  return (
    <EmptyState
      icon={FileText}
      title="No documents"
      description="Upload travel documents like passports, visas, and insurance to keep them secure."
    />
  );
}

export function NoGuidesEmptyState() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No guides available"
      description="Destination guides will be available once your trip starts."
    />
  );
}

export function NoAlertsEmptyState() {
  return (
    <EmptyState
      icon={AlertCircle}
      title="All caught up!"
      description="No new alerts or important updates at the moment."
    />
  );
}

export function NoPackingItemsEmptyState(props: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Luggage}
      title="Start packing"
      description="Add items to your packing list to keep track of what you need."
      action={
        props.onAdd ? { label: "Add item", onClick: props.onAdd } : undefined
      }
    />
  );
}
