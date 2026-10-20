import { useSelector } from "react-redux"
import type { RootState } from "../../../store/store"
import { Text } from "../../../components/Text/text"

export const Profile = () => {
    const user = useSelector((state: RootState) => state.auth.user)

    if (!user) {
        return <Text variant="p">Please log in to view your profile.</Text>
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
