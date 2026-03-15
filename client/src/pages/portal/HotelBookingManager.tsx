import { useState } from "react";
import {
  Building2,
  Plus,
  Trash2,
  Phone,
  Globe,
  MapPin,
  Key,
  Star,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface HotelReservation {
  id: string;
  hotelName: string;
  confirmationCode: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  roomNumber: string;
  guestName: string;
  email: string;
  phone: string;
  totalPrice: number;
  currency: string;
  address: string;
  city: string;
  website?: string;
  rating?: number;
  amenities: string[];
  notes?: string;
  checkInNotes?: string;
}

const AMENITIES = [
  "Free WiFi",
  "Gym",
  "Pool",
  "Spa",
  "Restaurant",
  "Bar",
  "Parking",
  "Pet Friendly",
  "Concierge",
  "Room Service",
  "Laundry",
  "Business Center",
];

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Suite",
  "Presidential Suite",
  "Penthouse",
];

export function HotelBookingManager() {
  const [reservations, setReservations] = useState<HotelReservation[]>([
    {
      id: "1",
      hotelName: "Waikiki Beach Resort",
      confirmationCode: "WBR12345",
      checkInDate: "2024-06-15",
      checkOutDate: "2024-06-22",
      roomType: "Deluxe",
      roomNumber: "1205",
      guestName: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      totalPrice: 2500,
      currency: "USD",
      address: "2300 Kalakaua Avenue",
      city: "Honolulu",
      website: "www.waikikiresort.com",
      rating: 4.5,
      amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
      checkInNotes: "Early check-in available after 2 PM",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    confirmationCode: "",
    checkInDate: "",
    checkOutDate: "",
    roomType: "Standard",
    roomNumber: "",
    guestName: "",
    email: "",
    phone: "",
    totalPrice: "",
    currency: "USD",
    address: "",
    city: "",
    website: "",
    rating: "4.0",
    amenities: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hotelName.trim()) newErrors.hotelName = "Hotel name required";
    if (!formData.confirmationCode)
      newErrors.confirmationCode = "Confirmation code required";
    if (!formData.checkInDate) newErrors.checkInDate = "Check-in date required";
    if (!formData.checkOutDate)
      newErrors.checkOutDate = "Check-out date required";
    if (!formData.guestName) newErrors.guestName = "Guest name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.totalPrice || isNaN(parseFloat(formData.totalPrice)))
      newErrors.totalPrice = "Valid price required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddReservation = () => {
    if (!validateForm()) return;

    const nights = Math.ceil(
      (new Date(formData.checkOutDate).getTime() -
        new Date(formData.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newReservation: HotelReservation = {
      id: Date.now().toString(),
      hotelName: formData.hotelName,
      confirmationCode: formData.confirmationCode,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      roomType: formData.roomType,
      roomNumber: formData.roomNumber,
      guestName: formData.guestName,
      email: formData.email,
      phone: formData.phone,
      totalPrice: parseFloat(formData.totalPrice),
      currency: formData.currency,
      address: formData.address,
      city: formData.city,
      website: formData.website,
      rating: parseFloat(formData.rating),
      amenities: formData.amenities,
    };

    setReservations([newReservation, ...reservations]);
    setFormData({
      hotelName: "",
      confirmationCode: "",
      checkInDate: "",
      checkOutDate: "",
      roomType: "Standard",
      roomNumber: "",
      guestName: "",
      email: "",
      phone: "",
      totalPrice: "",
      currency: "USD",
      address: "",
      city: "",
      website: "",
      rating: "4.0",
      amenities: [],
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
  };

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const totalNights = reservations.reduce((sum, r) => {
    const nights = Math.ceil(
      (new Date(r.checkOutDate).getTime() - new Date(r.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return sum + nights;
  }, 0);

  const totalSpent = reservations.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Reservations Summary
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Hotels</p>
            <p className="text-2xl font-bold text-foreground">
              {reservations.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-amber-500/30">
            <p className="text-xs text-amber-300">Total Nights</p>
            <p className="text-2xl font-bold text-amber-400">{totalNights}</p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Total Spent</p>
            <p className="text-2xl font-bold text-emerald-400">
              ${totalSpent.toFixed(2)}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg/Night</p>
            <p className="text-2xl font-bold text-foreground">
              ${totalNights > 0 ? (totalSpent / totalNights).toFixed(2) : "0"}
            </p>
          </div>
        </div>
      </Card>

      {/* Add Reservation Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel Reservation
        </Button>
      )}

      {/* Add Reservation Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">New Hotel Reservation</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.hotelName}>
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={formData.hotelName}
                  onChange={e => {
                    setFormData({ ...formData, hotelName: e.target.value });
                    setErrors({ ...errors, hotelName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.confirmationCode}>
                <input
                  type="text"
                  placeholder="Confirmation Code"
                  value={formData.confirmationCode}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      confirmationCode: e.target.value,
                    });
                    setErrors({ ...errors, confirmationCode: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.checkInDate}>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={e => {
                    setFormData({ ...formData, checkInDate: e.target.value });
                    setErrors({ ...errors, checkInDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.checkOutDate}>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={e => {
                    setFormData({ ...formData, checkOutDate: e.target.value });
                    setErrors({ ...errors, checkOutDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.roomType}
                onChange={e =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {ROOM_TYPES.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Room Number"
                value={formData.roomNumber}
                onChange={e =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.guestName}>
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={formData.guestName}
                  onChange={e => {
                    setFormData({ ...formData, guestName: e.target.value });
                    setErrors({ ...errors, guestName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.email}>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <div className="grid grid-cols-3 gap-3">
              <FormFieldWrapper error={errors.totalPrice}>
                <input
                  type="number"
                  placeholder="Total Price"
                  min="0"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={e => {
                    setFormData({ ...formData, totalPrice: e.target.value });
                    setErrors({ ...errors, totalPrice: "" });
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
              </select>

              <input
                type="number"
                placeholder="Rating"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={e =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={e =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <input
                type="url"
                placeholder="Website (optional)"
                value={formData.website}
                onChange={e =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Amenities Selection */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-xs px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.amenities.includes(amenity)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddReservation} className="flex-1">
                Add Reservation
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

      {/* Reservations List */}
      {reservations.length > 0 ? (
        <div className="space-y-3">
          {reservations.map(res => {
            const nights = Math.ceil(
              (new Date(res.checkOutDate).getTime() -
                new Date(res.checkInDate).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const pricePerNight = res.totalPrice / nights;

            return (
              <Card key={res.id} className="p-4 border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        {res.hotelName}
                      </h4>
                      {res.rating && (
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                          />
                          <span className="text-xs font-medium text-yellow-400">
                            {res.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{res.city}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteReservation(res.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Reservation Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-black/20 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-In</p>
                    <p className="font-medium text-foreground">
                      {res.checkInDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Check-Out</p>
                    <p className="font-medium text-foreground">
                      {res.checkOutDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Room</p>
                    <p className="font-medium text-foreground">
                      {res.roomType}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Nights</p>
                    <p className="font-medium text-foreground">{nights}</p>
                  </div>
                </div>

                {/* Guest & Contact Info */}
                <div className="space-y-2 mb-4 p-3 bg-black/20 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Confirmation:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {res.confirmationCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${res.phone}`}
                      className="text-primary hover:text-primary/80"
                    >
                      {res.phone}
                    </a>
                  </div>

                  {res.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={res.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {res.amenities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {res.amenities.map(amenity => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                  <div>
                    <p className="text-muted-foreground">Total Price</p>
                    <p className="font-bold text-emerald-400">
                      ${res.totalPrice.toFixed(2)} {res.currency}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-muted-foreground">Per Night</p>
                    <p className="font-bold text-emerald-400">
                      ${pricePerNight.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Building2}
            title="No Reservations"
            description="Add your hotel reservations to track bookings and amenities"
            action={{
              label: "Add Reservation",
              onClick: () => setShowForm(true),
            }}
          />
        )
      )}
    </div>
  );
}
