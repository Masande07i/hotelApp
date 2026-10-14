import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../store/store";

export const ProtectedAdminRoute = () => {
    const { user, token } = useSelector(
        (state: RootState) => state.auth
    );
    

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
