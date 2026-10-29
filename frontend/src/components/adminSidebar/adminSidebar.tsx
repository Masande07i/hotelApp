import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../Text/text";
import { CiHome, CiCalendar, CiUser } from "react-icons/ci";
import { BiBuildingHouse } from "react-icons/bi";
import style from "./adminSidebar.module.css"

export const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <aside className={style.sidebar}>
            <div className={style.logo}>
                <Text variant="h2">Havenly</Text>
                <Text variant="p">Admin Panel</Text>
            </div>

            <nav className={style.navigation}>
                <button
                    type="button"
                    className={location.pathname === "/admin" ? style.activeLink : ""}
                    onClick={() => navigate("/admin")}
                >
                    <CiHome />
                    Dashboard
                </button>

                <button
                    type="button"
                    className={location.pathname.startsWith("/admin/accommodations") ? style.activeLink : ""}
                    onClick={() => navigate("/admin/accommodations")}
                >
                    <BiBuildingHouse />
                    Accommodations
                </button>

                <button
                    type="button"
                    className={location.pathname.startsWith("/admin/reservations") ? style.activeLink : ""}
                    onClick={() => navigate("/admin/reservations")}
                >
                    <CiCalendar />
                    Reservations
                </button>

                <button
                    type="button"
                    className={location.pathname.startsWith("/admin/customers") ? style.activeLink : ""}
                    onClick={() => navigate("/admin/customers")}
                >
                    <CiUser />
                    Customers
                </button>
            </nav>
        </aside>
    );
};
