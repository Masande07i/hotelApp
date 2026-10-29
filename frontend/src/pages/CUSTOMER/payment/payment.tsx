
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import type { Accommodation } from "../../../features/accomodationSlice";
import type { Room } from "../../../features/roomSlice";
import type { Booking } from "../../../features/bookingSlice";

interface PaymentPageState {
    accommodation: Accommodation;
    room: Room;
    booking: Booking;
}

export const Payment = () => {
    const location = useLocation();

    const payment = location.state as PaymentPageState | null;
    const token = useSelector((state: RootState) => state.auth.token);
    console.log("Authentication token:", token);

    if (!payment) {
        return (
            <div>
                <Text variant="h2">No booking found</Text>
                <Text variant="p">
                    Please make a booking before proceeding to payment.
                </Text>
            </div>
        );
    }

    const { accommodation, room, booking } = payment;

    const handlePayNow = async () => {
        try {
            const response = await fetch("/api/payments/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    booking_id: booking.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to initialize payment");
                return;
            }

            if (!data.authorization_url) {
                alert("Paystack payment link was not returned");
                return;
            }

            window.location.href = data.authorization_url;

        } catch (error) {
            console.error("Payment error:", error);
            alert("Unable to connect to the server");
        }
    };

    return (
        <div>
            <Text variant="h1">Complete Your Payment</Text>

            <Text variant="h2">{accommodation.name}</Text>

            <Text variant="p">{room.room_type}</Text>

            <Text variant="p">
                Check-in: {booking.check_in}
            </Text>

            <Text variant="p">
                Check-out: {booking.check_out}
            </Text>

            <Text variant="h2">
                Total: R{Number(booking.total_price).toLocaleString("en-ZA")}
            </Text>

            <Button
                label="Pay Now"
                onClick={handlePayNow}
            />
        </div>
    );
};
