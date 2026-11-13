import { useNavigate,useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../../store/store"
import { Text } from "../Text/text"
import {
    CiUser,
    CiCalendar,
    CiHeart,
    CiBellOn
} from "react-icons/ci"
import { LuLogOut } from "react-icons/lu"
import {
    logout,
    startEditingProfile,
    updateProfileInputs,
    cancelEditingProfile,
    updateUserProfile
} from "../../features/authSlice"
import style from "./ProfileSidebar.module.css"

export const ProfileSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()

    const user = useSelector((state: RootState) => state.auth.user)
    const isEditing = useSelector((state: RootState) => state.auth.isEditingProfile)
    const profileInputs = useSelector((state: RootState) => state.auth.profileInputs)
    const error = useSelector((state: RootState) => state.auth.error)

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

    const handleSave = async () => {
        await dispatch(updateUserProfile(profileInputs))
    }

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
        navigate("/")
    }

    return (
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
                                    dispatch(
                                        updateProfileInputs({
                                            name: event.target.value
                                        })
                                    )
                                }
                            />
                        </label>

                        <label>
                            Email
                            <input
                                type="email"
                                value={profileInputs.email}
                                onChange={(event) =>
                                    dispatch(
                                        updateProfileInputs({
                                            email: event.target.value
                                        })
                                    )
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
                <button
                    className={location.pathname === "/profile" ? style.activeLink : ""}
                    onClick={() => navigate("/profile")}
                >
                    <CiUser />
                    My Profile
                </button>

                <button
                    className={location.pathname === "/MyBookings" ? style.activeLink : ""}
                    onClick={() => navigate("/MyBookings")}
                >
                    <CiCalendar />
                    My Bookings
                </button>

                <button
                    className={location.pathname === "/favourites" ? style.activeLink : ""}
                    onClick={() => navigate("/favourites")}
                >
                    <CiHeart />
                    Favourites
                </button>

                <button
                    className={location.pathname === "/notifications" ? style.activeLink : ""}
                    onClick={() => navigate("/notifications")}
                >
                    <CiBellOn />
                    Notifications
                </button>

                <div className={style.logout}>
                    <button type="button" onClick={handleLogout}>
                        <LuLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    )
}