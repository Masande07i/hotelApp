import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { AccommodationPopup } from "../../../components/Popup/accommodationPopup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import style from "./adminDashboard.module.css";
import { fetchAllBookings } from "../../../features/bookingSlice";
import { AdminSidebar } from "../../../components/adminSidebar/adminSidebar";
import {
    fetchDashboardStats,
    openDashboardForm,
    closeDashboardForm
} from "../../../features/dashboardSlice";

export const adminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const token = useSelector((state: RootState) => state.auth.token);

    const adminBookings = useSelector(
        (state: RootState) => state.booking.adminBookings
    );

    const {
        showForm,
        totalAccommodations,
        totalCustomers,
        totalRevenue,
        loading,
        error
    } = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchAllBookings());
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            dispatch(fetchDashboardStats(token));
        }
    }, [dispatch, token]);

    return (
        <div className={style.adminLayout}>
            <AdminSidebar />

            <div className={style.mainArea}>
                <header className={style.header}>
                    <div>
                        <Text variant="h1">Admin Dashboard</Text>
                        <Text variant="p">
                            Manage your Havenly accommodations and reservations.
                        </Text>
                    </div>

                    <Button
                        label="Add Accommodation"
                        onClick={() => dispatch(openDashboardForm())}
                        type="button"
                    />
                </header>

                {showForm && (
                    <AccommodationPopup
                        onClose={() => dispatch(closeDashboardForm())}
                    />
                )}

                <main className={style.content}>
                    <section className={style.stats}>
                        <div className={style.statCard}>
                            <Text variant="p">Total Accommodations</Text>
                            <Text variant="h2">
                                {loading ? "..." : totalAccommodations}
                            </Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Bookings</Text>
                            <Text variant="h2">
                                {adminBookings.length}
                            </Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Customers</Text>
                            <Text variant="h2">
                                {loading ? "..." : totalCustomers}
                            </Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Revenue</Text>
                            <Text variant="h2">
                                R {totalRevenue.toLocaleString("en-ZA")}
                            </Text>
                        </div>
                    </section>

                    {error && (
                        <Text variant="p">{error}</Text>
                    )}

                    <section className={style.section}>
                        <div className={style.sectionHeading}>
                            <Text variant="h2">Recent Reservations</Text>

                            <Button
                                label="View All Reservations"
                                onClick={() => navigate("/admin/reservations")}
                                type="button"
                            />
                        </div>

                        <div className={style.reservations}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer</th>
                                        <th>Accommodation</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Guests</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {adminBookings.slice(0, 4).map((booking) => (
                                        <tr key={booking.id}>
                                            <td>#{booking.id}</td>
                                            <td>{booking.customer_name}</td>
                                            <td>{booking.accommodation_name}</td>
                                            <td>
                                                {new Date(booking.check_in).toLocaleDateString("en-ZA")}
                                            </td>
                                            <td>
                                                {new Date(booking.check_out).toLocaleDateString("en-ZA")}
                                            </td>
                                            <td>{booking.number_of_guests}</td>
                                            <td>
                                                R {Number(booking.total_price).toLocaleString("en-ZA")}
                                            </td>
                                            <td>
                                                <span className={`${style.status} ${style[booking.status]}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {adminBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={8}>
                                                No reservations available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};
