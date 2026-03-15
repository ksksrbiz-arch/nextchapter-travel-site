import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Link, useSearch, useParams } from "wouter";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Plane,
  Plus,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  ArrowLeft,
  Loader2,
  Hash,
  ChevronRight,
  Users,
} from "lucide-react";

const STATUS_OPTIONS = [
  "planning",
  "confirmed",
  "active",
  "completed",
  "cancelled",
] as const;
const STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  active: "bg-amber-100 text-amber-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function TripForm({
  onSuccess,
  defaultClientId,
}: {
  onSuccess: () => void;
  defaultClientId?: number;
}) {
  const { data: clients } = trpc.admin.clients.useQuery();
  const [form, setForm] = useState({
    userId: defaultClientId?.toString() ?? "",
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    status: "planning" as const,
    notes: "",
    confirmationCode: "",
    coverImageUrl: "",
  });

  const createTrip = trpc.trips.create.useMutation({
    onSuccess: () => {
      toast.success("Trip created!");
      onSuccess();
    },
    onError: e => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId || !form.title || !form.destination) {
      toast.error("Client, title, and destination are required");
      return;
    }
    createTrip.mutate({
      userId: Number(form.userId),
      title: form.title,
      destination: form.destination,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      status: form.status,
      notes: form.notes || undefined,
      confirmationCode: form.confirmationCode || undefined,
      coverImageUrl: form.coverImageUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="font-sans text-sm font-medium">Client *</Label>
        <Select
          value={form.userId}
          onValueChange={v => setForm(f => ({ ...f, userId: v }))}
        >
          <SelectTrigger className="mt-1.5 font-sans">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map(c => (
              <SelectItem
                key={c.id}
                value={c.id.toString()}
                className="font-sans"
              >
                {c.name ?? c.email ?? `Client #${c.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="font-sans text-sm font-medium">Trip Title *</Label>
          <Input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g., Hawaii Honeymoon"
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm font-medium">Destination *</Label>
          <Input
            value={form.destination}
            onChange={e =>
              setForm(f => ({ ...f, destination: e.target.value }))
            }
            placeholder="e.g., Maui, Hawaii"
            className="mt-1.5 font-sans"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="font-sans text-sm font-medium">Start Date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm font-medium">End Date</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            className="mt-1.5 font-sans"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="font-sans text-sm font-medium">Status</Label>
          <Select
            value={form.status}
            onValueChange={v => setForm(f => ({ ...f, status: v as any }))}
          >
            <SelectTrigger className="mt-1.5 font-sans">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s} value={s} className="font-sans capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-sans text-sm font-medium">
            Confirmation Code
          </Label>
          <Input
            value={form.confirmationCode}
            onChange={e =>
              setForm(f => ({ ...f, confirmationCode: e.target.value }))
            }
            placeholder="e.g., NCT-2026-001"
            className="mt-1.5 font-sans"
          />
        </div>
      </div>
      <div>
        <Label className="font-sans text-sm font-medium">Cover Image URL</Label>
        <Input
          value={form.coverImageUrl}
          onChange={e =>
            setForm(f => ({ ...f, coverImageUrl: e.target.value }))
          }
          placeholder="https://..."
          className="mt-1.5 font-sans"
        />
      </div>
      <div>
        <Label className="font-sans text-sm font-medium">Notes</Label>
        <Textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Internal notes about this trip..."
          className="mt-1.5 font-sans"
          rows={3}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground font-sans"
        disabled={createTrip.isPending}
      >
        {createTrip.isPending && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Create Trip
      </Button>
    </form>
  );
}

export function AdminTripsList() {
  const { data: trips, isLoading, refetch } = trpc.trips.list.useQuery();
  const [open, setOpen] = useState(false);
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultClientId = params.get("client")
    ? Number(params.get("client"))
    : undefined;

  return (
    <AdminLayout title="Trips" subtitle="Manage all client trips">
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex gap-2">
          <Link
            href={`/admin/trips/new${defaultClientId ? `?client=${defaultClientId}` : ""}`}
          >
            <Button
              variant="outline"
              className="font-sans border-secondary text-secondary hover:bg-secondary/10"
            >
              <Plus className="w-4 h-4 mr-2" /> Trip Builder
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-sans">
                <Plus className="w-4 h-4 mr-2" /> Quick Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  Quick Create Trip
                </DialogTitle>
              </DialogHeader>
              <TripForm
                onSuccess={() => {
                  setOpen(false);
                  refetch();
                }}
                defaultClientId={defaultClientId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {!isLoading && (!trips || trips.length === 0) && (
        <div className="text-center py-16">
          <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            No Trips Yet
          </h3>
          <Button
            className="mt-2 bg-primary text-primary-foreground font-sans"
            onClick={() => setOpen(true)}
          >
            Create First Trip
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {trips?.map(trip => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">
                      {trip.title}
                    </h4>
                    <p className="text-muted-foreground font-sans text-sm flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.destination}
                    </p>
                    {trip.startDate && (
                      <p className="text-muted-foreground font-sans text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trip.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {trip.endDate &&
                          ` – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                      </p>
                    )}
                    {trip.confirmationCode && (
                      <p className="text-muted-foreground font-sans text-xs mt-0.5 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {trip.confirmationCode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    className={`text-xs font-sans ${STATUS_COLORS[trip.status]}`}
                  >
                    {trip.status}
                  </Badge>
                  <Link href={`/admin/trips/${trip.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-secondary font-sans text-xs"
                    >
                      Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}

export function AdminTripDetail() {
  const params = useParams<{ id: string }>();
  const tripId = Number(params.id);

  const {
    data: trip,
    isLoading,
    refetch,
  } = trpc.trips.getById.useQuery({ id: tripId });
  const { data: itinerary, refetch: refetchItinerary } =
    trpc.itinerary.list.useQuery({ tripId }, { enabled: !!tripId });
  const { data: bookings, refetch: refetchBookings } =
    trpc.bookings.list.useQuery({ tripId }, { enabled: !!tripId });

  const [itinForm, setItinForm] = useState({
    dayNumber: "1",
    time: "",
    title: "",
    description: "",
    location: "",
    category: "activity" as const,
    confirmationNumber: "",
    notes: "",
  });
  const [itinOpen, setItinOpen] = useState(false);

  const updateTrip = trpc.trips.update.useMutation({
    onSuccess: () => {
      toast.success("Trip updated");
      refetch();
    },
    onError: e => toast.error(e.message),
  });

  const deleteTrip = trpc.trips.delete.useMutation({
    onSuccess: () => {
      toast.success("Trip deleted");
      window.history.back();
    },
    onError: e => toast.error(e.message),
  });

  const createItinItem = trpc.itinerary.create.useMutation({
    onSuccess: () => {
      toast.success("Itinerary item added");
      setItinOpen(false);
      refetchItinerary();
    },
    onError: e => toast.error(e.message),
  });

  const deleteItinItem = trpc.itinerary.delete.useMutation({
    onSuccess: () => refetchItinerary(),
    onError: e => toast.error(e.message),
  });

  const [statusEdit, setStatusEdit] = useState<string | null>(null);

  if (isLoading)
    return (
      <AdminLayout title="Trip">
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </AdminLayout>
    );
  if (!trip)
    return (
      <AdminLayout title="Not Found">
        <p className="text-muted-foreground font-sans">Trip not found.</p>
      </AdminLayout>
    );

  const groupedItinerary = (itinerary ?? []).reduce(
    (acc, item) => {
      if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
      acc[item.dayNumber].push(item);
      return acc;
    },
    {} as Record<number, NonNullable<typeof itinerary>>
  );

  return (
    <AdminLayout title={trip.title} subtitle={trip.destination}>
      <Link href="/admin/trips">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 font-sans text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Trips
        </Button>
      </Link>

      {/* Trip header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {trip.title}
                </h2>
                <Select
                  value={statusEdit ?? trip.status}
                  onValueChange={v => {
                    setStatusEdit(v);
                    updateTrip.mutate({ id: trip.id, status: v as any });
                  }}
                >
                  <SelectTrigger className="w-36 font-sans text-xs h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="font-sans text-xs capitalize"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-muted-foreground font-sans text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {trip.destination}
              </p>
              {trip.startDate && (
                <p className="text-muted-foreground font-sans text-sm flex items-center gap-1.5 mt-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(trip.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {trip.endDate &&
                    ` – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 font-sans"
              onClick={() => {
                if (confirm("Delete this trip?"))
                  deleteTrip.mutate({ id: trip.id });
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete Trip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary builder */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-semibold text-foreground">
            Itinerary
          </h3>
          <Dialog open={itinOpen} onOpenChange={setItinOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground font-sans"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  Add Itinerary Item
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="font-sans text-sm">Day Number</Label>
                    <Input
                      type="number"
                      min="1"
                      value={itinForm.dayNumber}
                      onChange={e =>
                        setItinForm(f => ({ ...f, dayNumber: e.target.value }))
                      }
                      className="mt-1.5 font-sans"
                    />
                  </div>
                  <div>
                    <Label className="font-sans text-sm">Time</Label>
                    <Input
                      value={itinForm.time}
                      onChange={e =>
                        setItinForm(f => ({ ...f, time: e.target.value }))
                      }
                      placeholder="e.g., 9:00 AM"
                      className="mt-1.5 font-sans"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-sans text-sm">Title *</Label>
                  <Input
                    value={itinForm.title}
                    onChange={e =>
                      setItinForm(f => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g., Check-in at Resort"
                    className="mt-1.5 font-sans"
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Category</Label>
                  <Select
                    value={itinForm.category}
                    onValueChange={v =>
                      setItinForm(f => ({ ...f, category: v as any }))
                    }
                  >
                    <SelectTrigger className="mt-1.5 font-sans">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "flight",
                        "hotel",
                        "activity",
                        "dining",
                        "transport",
                        "free_time",
                        "other",
                      ].map(c => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="font-sans capitalize"
                        >
                          {c.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-sans text-sm">Location</Label>
                  <Input
                    value={itinForm.location}
                    onChange={e =>
                      setItinForm(f => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g., Grand Wailea Resort"
                    className="mt-1.5 font-sans"
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">Description</Label>
                  <Textarea
                    value={itinForm.description}
                    onChange={e =>
                      setItinForm(f => ({ ...f, description: e.target.value }))
                    }
                    className="mt-1.5 font-sans"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="font-sans text-sm">
                    Confirmation Number
                  </Label>
                  <Input
                    value={itinForm.confirmationNumber}
                    onChange={e =>
                      setItinForm(f => ({
                        ...f,
                        confirmationNumber: e.target.value,
                      }))
                    }
                    className="mt-1.5 font-sans"
                  />
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground font-sans"
                  disabled={!itinForm.title || createItinItem.isPending}
                  onClick={() =>
                    createItinItem.mutate({
                      tripId,
                      dayNumber: Number(itinForm.dayNumber),
                      time: itinForm.time || undefined,
                      title: itinForm.title,
                      description: itinForm.description || undefined,
                      location: itinForm.location || undefined,
                      category: itinForm.category,
                      confirmationNumber:
                        itinForm.confirmationNumber || undefined,
                      notes: itinForm.notes || undefined,
                    })
                  }
                >
                  {createItinItem.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Add to Itinerary
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {(!itinerary || itinerary.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground font-sans text-sm">
              No itinerary items yet. Add the first one!
            </p>
          </div>
        )}

        {Object.entries(groupedItinerary).map(([day, dayItems]) => (
          <div key={day} className="mb-4">
            <h4 className="text-sm font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Day {day}
            </h4>
            <div className="space-y-2">
              {(dayItems ?? []).map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground font-sans text-xs">
                      {item.time && `${item.time} · `}
                      {item.category} {item.location && `· ${item.location}`}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItinItem.mutate({ id: item.id })}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
