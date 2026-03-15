import { HotelBookingManager } from "@/pages/portal/HotelBookingManager";

export default function HotelPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hotel Bookings</h1>
        <p className="text-muted-foreground">
          Manage and track all your hotel reservations
        </p>
      </div>
      <HotelBookingManager />
    </div>
  );
}
