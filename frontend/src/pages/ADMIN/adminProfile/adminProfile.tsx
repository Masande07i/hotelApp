
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { Text } from "../../../components/Text/text";
import { AdminSidebar } from "../../../components/adminSidebar/adminSidebar";
// import { CiUser } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import {
    logout,
    startEditingProfile,
    updateProfileInputs,
    cancelEditingProfile,
    updateUserProfile
} from "../../../features/authSlice";
import style from "./adminProfile.module.css";

export const AdminProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.auth.user);
    const isEditing = useSelector((state: RootState) => state.auth.isEditingProfile);
    const profileInputs = useSelector((state: RootState) => state.auth.profileInputs);
    const error = useSelector((state: RootState) => state.auth.error);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const initials = user.name
        .trim()
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleSave = async () => {
        await dispatch(updateUserProfile(profileInputs));
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("auth");
        navigate("/");
    };

    return (
        <div className={style.adminLayout}>
            <AdminSidebar />

            <main className={style.mainArea}>
                <div className={style.profilePage}>
                    <Text variant="h1">Admin Profile</Text>

                    <div className={style.profileCard}>
                        <div className={style.avatar}>{initials}</div>

                        {isEditing ? (
                            <div className={style.editForm}>
                                <label>
                                    Full name
                                    <input
                                        type="text"
                                        value={profileInputs.name}
                                        onChange={(event) =>
                                            dispatch(updateProfileInputs({
                                                name: event.target.value
                                            }))
                                        }
                                    />
                                </label>

                                <label>
                                    Email
                                    <input
                                        type="email"
                                        value={profileInputs.email}
                                        onChange={(event) =>
                                            dispatch(updateProfileInputs({
                                                email: event.target.value
                                            }))
                                        }
                                    />
                                </label>

                                {error && <p>{error}</p>}

                                <div className={style.actions}>
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
                            </div>
                        ) : (
                            <div className={style.userInfo}>
                                <Text variant="h2">{user.name}</Text>
                                <Text variant="p">{user.email}</Text>
                                <Text variant="p">Administrator</Text>

                                <button
                                    type="button"
                                    onClick={() => dispatch(startEditingProfile())}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={style.logout}
                        onClick={handleLogout}
                    >
                        <LuLogOut />
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
};
