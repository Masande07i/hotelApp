import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../store/store"
import { Text } from "../../../components/Text/text"

export const Profile = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    if (!user) {
        return null
    }

    return (
        <div>
            <Text variant="h1">My Profile</Text>

            {user.profile_image && (
                <img
                    src={user.profile_image}
                    alt="Profile"
                    width="120"
                    height="120"
                />
            )}

            <Text variant="h2">{user.name}</Text>
            <Text variant="p">Email: {user.email}</Text>
            <Text variant="p">Account type: {user.role}</Text>
        </div>
    )
}
