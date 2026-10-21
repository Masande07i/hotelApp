import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { AccommodationPopup } from "../../../components/Popup/accommodationPopup/accommodationPopup";
import { CiHome,  CiCalendar, CiUser, } from "react-icons/ci";
import style from "./adminDashboard.module.css";

export const adminDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className={style.adminLayout}>
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

            <div className={style.mainArea}>
                <header className={style.header}>
                    <Text variant="h1">Admin Dashboard</Text>
                    <Text variant="p">
                        Manage your Havenly accommodations and reservations.
                    </Text>
                </header>

                <main className={style.content}>
                    <section className={style.section}>
                        <div className={style.sectionHeading}>
                            <div>
                                <Text variant="h2">Manage Accommodations</Text>
                                
                            </div>

                            <Button
                                label="Add Accommodation"
                                onClick={() => setShowForm(!showForm)}
                                type="button"
                            />
                        </div>

                        {showForm && (
                            <AccommodationPopup
                                onClose={() => setShowForm(false)}
                            />
                        )}
                    </section>

                </main>
            </div>
        </div>
    );
};
