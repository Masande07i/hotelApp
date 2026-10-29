import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store/store"
import { Text } from "../../../components/Text/text"
import { CiUser, CiCalendar, CiHeart, CiStar, CiBellOn} from "react-icons/ci"
import style from "./profile.module.css"
import { LuLogOut } from "react-icons/lu"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../store/store"
import { logout,startEditingProfile,updateProfileInputs,cancelEditingProfile,updateUserProfile } from "../../../features/authSlice"
import { fetchMyBookings,setSelectedTab  } from "../../../features/bookingSlice"
import { fetchFavourites } from "../../../features/favouriteSlice"

export const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const isEditing = useSelector((state: RootState) => state.auth.isEditingProfile)
    const profileInputs = useSelector((state: RootState) => state.auth.profileInputs)
    const error = useSelector((state: RootState) => state.auth.error)
    const bookings = useSelector((state: RootState) => state.booking.bookings)
    const loading = useSelector((state: RootState) => state.booking.loading)
    const bookingError = useSelector((state: RootState) => state.booking.error)
    const selectedTab = useSelector((state: RootState) => state.booking.selectedTab)
    const favourites = useSelector((state: RootState) => state.favourite.favourites)
    
    const filteredBookings = bookings.filter((booking) => {
        if (selectedTab === "cancelled") {
            return booking.status === "cancelled"
        }

        if (selectedTab === "past") {
            return booking.status !== "cancelled" &&
                new Date(booking.check_out) < new Date()
        }

        return booking.status !== "cancelled" &&
            new Date(booking.check_in) >= new Date()
    })

    const handleSave = async () => {
    await dispatch(updateUserProfile(profileInputs))
    }

  useEffect(() => {
    if (user) {
        dispatch(fetchMyBookings())
        dispatch(fetchFavourites())
    }
}, [user, dispatch])

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    if (!user) {
        return null
    }

    const initials = user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("auth")
    navigate('/')
}

    return (
        <div className={style.profilePage}>
            <Text variant="h1">User Profile</Text>

            <div className={style.profileLayout}>
                <aside className={style.sidebar}>
                    <div className={style.userInfo}>
                    <div className={style.avatar}>{initials}</div>

                    {isEditing ? (
                        <div>
                        <label>
                            Full name
                            <input
                            type="text"
                            value={profileInputs.name}
                            onChange={(event) =>
                                dispatch(updateProfileInputs({ name: event.target.value }))
                            }
                            />
                        </label>

                        <label>
                            Email
                            <input
                            type="email"
                            value={profileInputs.email}
                            onChange={(event) =>
                                dispatch(updateProfileInputs({ email: event.target.value }))
                            }
                            />
                        </label>

                        {error && <p>{error}</p>}

                        <button type="button" onClick={handleSave}>
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={() => dispatch(cancelEditingProfile())}
                        >
                            Cancel
                        </button>
                        </div>
                    ) : (
                        <>
                        <Text variant="h2">{user.name}</Text>
                        <Text variant="p">{user.email}</Text>

                        <button
                            type="button"
                            onClick={() => dispatch(startEditingProfile())}
                        >
                            Edit Profile
                        </button>
                        </>
                    )}
                    </div>

                    <nav className={style.profileNav}>
                        <button className={style.activeLink} onClick={() => navigate('/profile')}>
                            <CiUser /> My Profile
                        </button>
                        <button onClick={() => navigate('/my-bookings')}>
                            <CiCalendar /> My Bookings
                        </button>
                        <button onClick={() => navigate('/favourites')}>
                            <CiHeart /> Favourites
                        </button>
                        <button onClick={() => navigate('/reviews')}>
                            <CiStar /> Reviews
                        </button>
                        <button onClick={() => navigate('/notifications')}>
                            <CiBellOn/>Notifications
                        </button>

                       <div className={style.logout}>
                         <button type="button" onClick={handleLogout}>
                            <LuLogOut />
                            <span>Logout</span>
                         </button>
                      </div>
                    
                    </nav>
                </aside>

                <main className={style.profileContent}>
                    <Text variant="h2">My Bookings</Text>
                    
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

                <div className={style.emptySection}>
                    {loading && <p>Loading your bookings...</p>}

                    {bookingError && <p>{bookingError}</p>}

                    
                    {!loading && !bookingError && filteredBookings.length === 0 && (
                        <p>
                            {selectedTab === "upcoming" &&
                                "You have no upcoming bookings yet."}
                            {selectedTab === "past" &&
                                "You have no past bookings yet."}
                            {selectedTab === "cancelled" &&
                                "You have no cancelled bookings yet."}
                        </p>
                    )}


                    {filteredBookings.map((booking) => (
                       <div key={booking.id} className={style.bookingCard}>
                            <Text variant="h2">{booking.accommodation_name}</Text>
                            <Text variant="p">{booking.accommodation_address}</Text>
                            <Text variant="p">Room: {booking.room_type}</Text>
                            <Text variant="p">Bed: {booking.bed_type || "Not specified"}</Text>
                            <Text variant="p">Check-in: {booking.check_in}</Text>
                            <Text variant="p">Check-out: {booking.check_out}</Text>
                            <Text variant="p">Rooms: {booking.number_of_rooms}</Text>
                            <Text variant="p">Guests: {booking.number_of_guests}</Text>
                            <Text variant="p">
                                Total: R{Number(booking.total_price).toFixed(2)}
                            </Text>
                            <Text variant="p">Status: {booking.status}</Text>
                        </div>
                    ))}
                </div>

                   <Text variant="h2">Favourite Hotels</Text>

                    <div className={style.emptySection}>
                        {favourites.length === 0 ? (
                            <p>You haven't added any favourite hotels yet.</p>
                        ) : (
                            favourites.map((accommodation) => (
                                <div key={accommodation.id} className={style.bookingCard}>
                                    <Text variant="h2">{accommodation.name}</Text>
                                    <Text variant="p">
                                        {accommodation.city}, {accommodation.country}
                                    </Text>
                                    <Text variant="p">{accommodation.address}</Text>

                                    <button
                                        type="button"
                                        onClick={() => navigate(`/accommodations/${accommodation.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                 </main>
            </div>
        </div>
    )
}
