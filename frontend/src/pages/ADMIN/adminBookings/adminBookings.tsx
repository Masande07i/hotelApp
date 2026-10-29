import { Text } from "../../../components/Text/text";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchAllBookings, updateBookingStatus } from "../../../features/bookingSlice";
import style from "./adminBookings.module.css";
import { AdminSidebar } from "../../../components/adminSidebar/adminSidebar";

export const AdminBookings = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { adminBookings, loading, error } = useSelector(
        (state: RootState) => state.booking
    );

    useEffect(() => {
        dispatch(fetchAllBookings());
    }, [dispatch]);

    
return (
    <div className={style.adminLayout}>
        <AdminSidebar />

        <div className={style.mainArea}>
            <div className={style.bookingsPage}>
                <div className={style.pageHeader}>
                    <Text variant="h1">Manage Bookings</Text>
                    <Text variant="p">
                        View and manage customer bookings.
                    </Text>
                </div>

                {loading && (
                    <Text variant="p">Loading bookings...</Text>
                )}

                {error && (
                    <Text variant="p">{error}</Text>
                )}

                {!loading && !error && adminBookings.length === 0 && (
                    <Text variant="p">No bookings found.</Text>
                )}

                {!loading && !error && adminBookings.length > 0 && (
                    <div className={style.bookingsList}>
                        {adminBookings.map((booking) => (
                            <div key={booking.id} className={style.bookingCard}>
                                <div className={style.bookingTitle}>
                                    <Text variant="h2">
                                        Booking #{booking.id}
                                    </Text>
                                </div>

                                <div className={style.bookingInfo}>
                                    <Text variant="p">
                                        Accommodation: {booking.accommodation_name}
                                    </Text>

                                    <Text variant="p">
                                        Room: {booking.room_type}
                                    </Text>

                                    <Text variant="p">
                                        Check-in: {booking.check_in}
                                    </Text>

                                    <Text variant="p">
                                        Check-out: {booking.check_out}
                                    </Text>

                                    <Text variant="p">
                                        Guests: {booking.number_of_guests}
                                    </Text>

                                    <Text variant="p">
                                        Total: R{booking.total_price}
                                    </Text>
                                </div>

                                <div>
                                    <span
                                        className={`${style.statusBadge} ${
                                            booking.status === "pending"
                                                ? style.statusPending
                                                : booking.status === "confirmed"
                                                ? style.statusConfirmed
                                                : style.statusCancelled
                                        }`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                <div className={style.bookingStatus}>
                                    <select
                                        value={booking.status}
                                        onChange={(e) =>
                                            dispatch(
                                                updateBookingStatus({
                                                    bookingId: booking.id,
                                                    status: e.target.value as
                                                        "pending" | "confirmed" | "cancelled"
                                                })
                                            )
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);
}