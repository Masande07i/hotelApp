import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../../store/store"
import { Text } from "../../../components/Text/text"
import { CiUser, CiCalendar, CiHeart, CiBellOn } from "react-icons/ci"
import { IoArrowBackCircle } from "react-icons/io5"
import { LuLogOut } from "react-icons/lu"
import { logout } from "../../../features/authSlice"
import {
    fetchMyBookings,
    cancelBooking,
    setSelectedTab
} from "../../../features/bookingSlice"
import { Footer } from "../../../components/footer/footer"
import style from "./myBookings.module.css"

export const MyBookings = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const user = useSelector((state: RootState) => state.auth.user)
    const bookings = useSelector((state: RootState) => state.booking.bookings)
    const loading = useSelector((state: RootState) => state.booking.loading)
    const error = useSelector((state: RootState) => state.booking.error)
    const selectedTab = useSelector((state: RootState) => state.booking.selectedTab)
    const cancellingBookingId = useSelector(
        (state: RootState) => state.booking.cancellingBookingId
    )

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }

        dispatch(fetchMyBookings())
    }, [user, dispatch, navigate])

    if (!user) {
        return null
    }

    const initials = user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const today = new Date()

    const filteredBookings = bookings.filter((booking) => {
        if (selectedTab === "cancelled") {
            return booking.status === "cancelled"
        }

        if (selectedTab === "past") {
            return booking.status !== "cancelled" &&
                new Date(booking.check_out) < today
        }

        return booking.status !== "cancelled" &&
            new Date(booking.check_out) >= today
    })

    const handleCancel = (bookingId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        )

        if (confirmed) {
            dispatch(cancelBooking(bookingId))
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
        navigate("/")
    }

    return (
        <div className={style.bookingsPage}>
            <button
                type="button"
                className={style.backButton}
                onClick={() => navigate("/")}
            >
                <IoArrowBackCircle />
            </button>

            <Text variant="h1">My Bookings</Text>

            <div className={style.bookingsLayout}>
                <aside className={style.sidebar}>
                    <div className={style.userInfo}>
                        <div className={style.avatar}>{initials}</div>
                        <Text variant="h2">{user.name}</Text>
                        <Text variant="p">{user.email}</Text>
                    </div>

                    <nav className={style.profileNav}>
                        <button onClick={() => navigate("/profile")}>
                            <CiUser /> My Profile
                        </button>

                        <button className={style.activeLink}>
                            <CiCalendar /> My Bookings
                        </button>

                        <button onClick={() => navigate("/favourites")}>
                            <CiHeart /> Favourites
                        </button>

                        <button onClick={() => navigate("/notifications")}>
                            <CiBellOn /> Notifications
                        </button>

                        <div className={style.logout}>
                            <button type="button" onClick={handleLogout}>
                                <LuLogOut />
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                <main className={style.bookingsContent}>
                    <Text variant="h2">Your Reservations</Text>

                    <div className={style.bookingTabs}>
                        <button
                            className={selectedTab === "upcoming" ? style.selectedTab : ""}
                            onClick={() => dispatch(setSelectedTab("upcoming"))}
                        >
                            Upcoming
                        </button>

                        <button
                            className={selectedTab === "past" ? style.selectedTab : ""}
                            onClick={() => dispatch(setSelectedTab("past"))}
                        >
                            Past
                        </button>

                        <button
                            className={selectedTab === "cancelled" ? style.selectedTab : ""}
                            onClick={() => dispatch(setSelectedTab("cancelled"))}
                        >
                            Cancelled
                        </button>
                    </div>

                    {loading && <p>Loading your bookings...</p>}

                    {error && <p className={style.error}>{error}</p>}

                    {!loading && !error && filteredBookings.length === 0 && (
                        <div className={style.emptySection}>
                            {selectedTab === "upcoming" &&
                                <p>You have no upcoming bookings yet.</p>}
                            {selectedTab === "past" &&
                                <p>You have no past bookings yet.</p>}
                            {selectedTab === "cancelled" &&
                                <p>You have no cancelled bookings yet.</p>}
                        </div>
                    )}

                    {!loading && filteredBookings.map((booking) => (
                        <div key={booking.id} className={style.bookingCard}>
                            <div className={style.bookingHeader}>
                                <div>
                                    <Text variant="h2">
                                        {booking.accommodation_name}
                                    </Text>
                                    <p>{booking.accommodation_address}</p>
                                </div>

                                <span className={`${style.bookingStatus} ${style[booking.status]}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className={style.bookingDetails}>
                                <p><strong>Room:</strong> {booking.room_type}</p>
                                <p><strong>Bed:</strong> {booking.bed_type || "Not specified"}</p>
                                <p><strong>Check-in:</strong> {new Date(booking.check_in).toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> {new Date(booking.check_out).toLocaleDateString()}</p>
                                <p><strong>Rooms:</strong> {booking.number_of_rooms}</p>
                                <p><strong>Guests:</strong> {booking.number_of_guests}</p>
                            </div>

                            <div className={style.bookingFooter}>
                                <Text variant="p">
                                    Total: R{Number(booking.total_price).toFixed(2)}
                                </Text>

                                <div className={style.bookingActions}>
                                    <button
                                        type="button"
                                        onClick={() => navigate(
                                            `/accommodations/${booking.accommodation_id}`
                                        )}
                                    >
                                        View Accommodation
                                    </button>

                                    {booking.status !== "cancelled" &&
                                        new Date(booking.check_out) >= today && (
                                            <button
                                                type="button"
                                                className={style.cancelButton}
                                                disabled={cancellingBookingId === booking.id}
                                                onClick={() => handleCancel(booking.id)}
                                            >
                                                {cancellingBookingId === booking.id
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"}
                                            </button>
                                        )}

                                    {booking.status === "confirmed" &&
                                        new Date(booking.check_out) < today && (
                                            <button
                                                type="button"
                                                onClick={() => navigate(
                                                    `/write-review/${booking.accommodation_id}`
                                                )}
                                            >
                                                Write a Review
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>

            <Footer />
        </div>
    )
}
