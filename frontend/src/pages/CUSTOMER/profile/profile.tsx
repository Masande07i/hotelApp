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

export const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const isEditing = useSelector((state: RootState) => state.auth.isEditingProfile)
    const profileInputs = useSelector((state: RootState) => state.auth.profileInputs)
    const error = useSelector((state: RootState) => state.auth.error)

    const handleSave = async () => {
    await dispatch(updateUserProfile(profileInputs))
    }

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
                        <button className={style.selectedTab}>Upcoming</button>
                        <button>Past</button>
                        <button>Cancelled</button>
                    </div>

                    <div className={style.emptySection}>
                        Your bookings will appear here.
                    </div>

                    <Text variant="h2">Favourite Hotels</Text>
                    <div className={style.emptySection}>
                        Your favourite hotels will appear here.
                    </div>
                </main>
            </div>
        </div>
    )
}
