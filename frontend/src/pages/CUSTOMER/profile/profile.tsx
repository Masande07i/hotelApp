
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../../store/store"
import { Text } from "../../../components/Text/text"
import { IoArrowBackCircle } from "react-icons/io5"
import {
    fetchMyBookings,
    setSelectedTab
} from "../../../features/bookingSlice"
import { fetchFavourites } from "../../../features/favouriteSlice"
import { Footer } from "../../../components/footer/footer"
import { ProfileSidebar } from "../../../components/ProfileSidebar/ProfileSidebar"
import style from "./profile.module.css"

export const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const user = useSelector((state: RootState) => state.auth.user)
    const bookings = useSelector((state: RootState) => state.booking.bookings)
    const loading = useSelector((state: RootState) => state.booking.loading)
    const bookingError = useSelector(
        (state: RootState) => state.booking.error
    )
    const selectedTab = useSelector(
        (state: RootState) => state.booking.selectedTab
    )
    const favourites = useSelector(
        (state: RootState) => state.favourite.favourites
    )

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }

        dispatch(fetchMyBookings())
        dispatch(fetchFavourites())
    }, [user, dispatch, navigate])

    if (!user) {
        return null
    }

    const filteredBookings = bookings.filter((booking) => {
        if (selectedTab === "cancelled") {
            return booking.status === "cancelled"
        }

        if (selectedTab === "past") {
            return (
                booking.status !== "cancelled" &&
                new Date(booking.check_out) < new Date()
            )
        }

        return (
            booking.status !== "cancelled" &&
            new Date(booking.check_in) >= new Date()
        )
    })

    return (
        <div className={style.profilePage}>
            <button
                type="button"
                onClick={() => navigate("/")}
            >
                <IoArrowBackCircle />
            </button>

            <Text variant="h1">User Profile</Text>

            <div className={style.profileLayout}>
                <ProfileSidebar />

                <main className={style.profileContent}>
                    <Text variant="h2">My Bookings</Text>

                    <div className={style.bookingTabs}>
                        <button
                            className={
                                selectedTab === "upcoming"
                                    ? style.selectedTab
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setSelectedTab("upcoming"))
                            }
                        >
                            Upcoming
                        </button>

                        <button
                            className={
                                selectedTab === "past"
                                    ? style.selectedTab
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setSelectedTab("past"))
                            }
                        >
                            Past
                        </button>

                        <button
                            className={
                                selectedTab === "cancelled"
                                    ? style.selectedTab
                                    : ""
                            }
                            onClick={() =>
                                dispatch(setSelectedTab("cancelled"))
                            }
                        >
                            Cancelled
                        </button>
                    </div>

                    <div className={style.emptySection}>
                        {loading && <p>Loading your bookings...</p>}

                        {bookingError && <p>{bookingError}</p>}

                        {!loading &&
                            !bookingError &&
                            filteredBookings.length === 0 && (
                                <p>
                                    {selectedTab === "upcoming" &&
                                        "You have no upcoming bookings yet."}

                                    {selectedTab === "past" &&
                                        "You have no past bookings yet."}

                                    {selectedTab === "cancelled" &&
                                        "You have no cancelled bookings yet."}
                                </p>
                            )}

                        {!loading &&
                            !bookingError &&
                            filteredBookings.slice(0, 2).map((booking) => (
                                <div
                                    key={booking.id}
                                    className={style.bookingCard}
                                >
                                    <Text variant="h2">
                                        {booking.accommodation_name}
                                    </Text>

                                    <Text variant="p">
                                        {booking.accommodation_address}
                                    </Text>

                                    <Text variant="p">
                                        Room: {booking.room_type}
                                    </Text>

                                    <Text variant="p">
                                        Bed:{" "}
                                        {booking.bed_type || "Not specified"}
                                    </Text>

                                    <Text variant="p">
                                        Check-in: {booking.check_in}
                                    </Text>

                                    <Text variant="p">
                                        Check-out: {booking.check_out}
                                    </Text>

                                    <Text variant="p">
                                        Rooms: {booking.number_of_rooms}
                                    </Text>

                                    <Text variant="p">
                                        Guests: {booking.number_of_guests}
                                    </Text>

                                    <Text variant="p">
                                        Total: R
                                        {Number(
                                            booking.total_price
                                        ).toFixed(2)}
                                    </Text>

                                    <Text variant="p">
                                        Status: {booking.status}
                                    </Text>

                                    <div className={style.bookingActions}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/accommodations/${booking.accommodation_id}`
                                                )
                                            }
                                        >
                                            View Accommodation
                                        </button>

                                        {booking.status === "confirmed" &&
                                            new Date(booking.check_out) <
                                                new Date() && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/write-review/${booking.accommodation_id}`
                                                        )
                                                    }
                                                >
                                                    Write a Review
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}

                        {!loading &&
                            !bookingError &&
                            filteredBookings.length > 0 && (
                                <button
                                    type="button"
                                    className={style.viewAllButton}
                                    onClick={() => navigate("/MyBookings")}
                                >
                                    View All Bookings
                                </button>
                            )}
                    </div>

                    <Text variant="h2">Favourite Hotels</Text>

                    <div className={style.emptySection}>
                        {favourites.length === 0 ? (
                            <p>
                                You haven't added any favourite hotels yet.
                            </p>
                        ) : (
                            favourites.slice(0, 2).map((accommodation) => (
                                <div
                                    key={accommodation.id}
                                    className={style.bookingCard}
                                >
                                    <Text variant="h2">
                                        {accommodation.name}
                                    </Text>

                                    <Text variant="p">
                                        {accommodation.city},{" "}
                                        {accommodation.country}
                                    </Text>

                                    <Text variant="p">
                                        {accommodation.address}
                                    </Text>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/accommodations/${accommodation.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        )}

                        {favourites.length > 0 && (
                            <button
                                type="button"
                                className={style.viewAllButton}
                                onClick={() => navigate("/favourites")}
                            >
                                View All Favourites
                            </button>
                        )}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}
