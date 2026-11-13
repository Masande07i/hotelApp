import style from './navbar.module.css'
import { Text } from '../Text/text'
import { Button } from '../button/button'
import { CiHome, CiUser } from "react-icons/ci"
import { IoNotificationsOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import { fetchUnreadCount } from '../../features/notificationSlice'

interface NavbarProps {
    className?: string
}

export const Navbar = ({ className }: NavbarProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const user = useSelector((state: RootState) => state.auth.user)
    const unreadCount = useSelector(
        (state: RootState) => state.notification.unreadCount
    )

    const handleNotifications = () => {
        dispatch(fetchUnreadCount())
        navigate('/notifications')
    }

    return (
        <nav className={`${style.navbar} ${className || ""}`}>
            <div className={style.logo}>
                <CiHome className={style.logoIcon} />
                <Text variant="h2">Havenly</Text>
            </div>

            <div className={style.links}>
                <a href="/">Home</a>
                <a href="/accomodations">Hotels</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>

            <div className={style.actions}>
                {user ? (
                    <>
                        <button
                            type="button"
                            className={style.notificationButton}
                            onClick={handleNotifications}
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <IoNotificationsOutline />

                            {unreadCount > 0 && (
                                <span className={style.notificationBadge}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            className={style.profileButton}
                            onClick={() => navigate('/profile')}
                            aria-label="My Profile"
                            title="My Profile"
                        >
                            <CiUser />
                        </button>
                    </>
                ) : (
                    <>
                        <Button
                            label="LOGIN"
                            type="button"
                            onClick={() => navigate('/login')}
                        />

                        <Button
                            label="SIGN UP"
                            type="button"
                            onClick={() => navigate('/signup')}
                        />
                    </>
                )}
            </div>
        </nav>
    )
}
