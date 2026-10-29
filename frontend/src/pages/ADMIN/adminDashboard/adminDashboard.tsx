import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { AccommodationPopup } from "../../../components/Popup/accommodationPopup";
import { CiHome, CiCalendar, CiUser } from "react-icons/ci";
import { useSelector , useDispatch} from "react-redux";
import type { RootState,AppDispatch } from "../../../store/store";
import style from "./adminDashboard.module.css";
import { fetchAllBookings } from "../../../features/bookingSlice"
import { BiBuildingHouse } from "react-icons/bi";


export const adminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    const adminBookings = useSelector(
        (state: RootState) => state.booking.adminBookings
    );
    const [showForm, setShowForm] = useState(false);
    const [totalAccommodations, setTotalAccommodations] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
    dispatch(fetchAllBookings());
}, [dispatch]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [accommodationsResponse, bookingsResponse, usersResponse, revenueResponse] =
                    await Promise.all([
                        fetch("/api/accommodations"),
                        fetch("/api/bookings/all", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }),
                        fetch("/api/users", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }),
                        fetch("/api/payments/revenue", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    ]);

                if (!accommodationsResponse.ok || !bookingsResponse.ok ||
                    !usersResponse.ok || !revenueResponse.ok) {
                    throw new Error("Failed to fetch dashboard statistics");
                }

                const accommodations = await accommodationsResponse.json();
                const bookings = await bookingsResponse.json();
                const users = await usersResponse.json();
                const revenue = await revenueResponse.json();

                setTotalAccommodations(accommodations.length);
                setTotalBookings(bookings.bookings.length);
                setTotalCustomers(users.length);
                setTotalRevenue(revenue.totalRevenue);

            } catch (error) {
                console.error("Dashboard data error:", error);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    return (
        <div className={style.adminLayout}>
            <aside className={style.sidebar}>
                <div className={style.logo}>
                    <Text variant="h2">Havenly</Text>
                    <Text variant="p">Admin Panel</Text>
                </div>

                <nav className={style.navigation}>
                    <button
                        type="button"
                        className={location.pathname === "/admin" ? style.activeLink : ""}
                        onClick={() => navigate("/admin")}
                    >
                        <CiHome />
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className={location.pathname.startsWith("/admin/accommodations") ? style.activeLink : ""}
                        onClick={() => navigate("/admin/accommodations")}
                    >
                        <BiBuildingHouse />
                        Accommodations
                    </button>

                    <button
                        type="button"
                        className={location.pathname.startsWith("/admin/reservations") ? style.activeLink : ""}
                        onClick={() => navigate("/admin/reservations")}
                    >
                        <CiCalendar />
                        Reservations
                    </button>

                    <button
                        type="button"
                        className={location.pathname.startsWith("/admin/customers") ? style.activeLink : ""}
                        onClick={() => navigate("/admin/customers")}
                    >
                        <CiUser />
                        Customers
                    </button>
                </nav>
            </aside>

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
                        onClick={() => setShowForm(!showForm)}
                        type="button"
                    />
                </header>

                {showForm && (
                    <AccommodationPopup
                        onClose={() => setShowForm(false)}
                    />
                )}


                <main className={style.content}>
                    <section className={style.stats}>
                        <div className={style.statCard}>
                            <Text variant="p">Total Accommodations</Text>
                            <Text variant="h2">{totalAccommodations}</Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Bookings</Text>
                            <Text variant="h2">{totalBookings}</Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Customers</Text>
                            <Text variant="h2">{totalCustomers}</Text>
                        </div>

                        <div className={style.statCard}>
                            <Text variant="p">Total Revenue</Text>
                            <Text variant="h2">
                                R {totalRevenue.toLocaleString("en-ZA")}
                            </Text>
                        </div>
                    </section>

                   
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
                                        <td colSpan={7}>No reservations available.</td>
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
