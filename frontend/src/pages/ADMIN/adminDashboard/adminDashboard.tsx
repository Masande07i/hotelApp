import { useState } from "react";
import { Link } from "react-router-dom";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { AccommodationPopup } from "../../../components/Popup/accommodationPopup/accommodationPopup";
import style from "./adminDashboard.module.css";

export const adminDashboard = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className={style.dashboard}>
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
                            <Text variant="p">
                                Add and manage your hotel properties.
                            </Text>
                        </div>

                        <Button
                            label="Add Accommodation"
                            onClick={() => setShowForm(!showForm)}
                            type="button"
                        />
                    </div>

                    <div className={style.managementLink}>
                        <Text variant="h2">Your Accommodations</Text>
                        <Link to="/admin/accommodations">
                            Manage Accommodations 
                        </Link>
                    </div>

                    {showForm && (
                        <AccommodationPopup
                            onClose={() => setShowForm(false)}
                        />
                    )}
                </section>

                <section className={style.section}>
                    <Text variant="h2">Manage Reservations</Text>
                    <Text variant="p">
                        View and manage customer bookings.
                    </Text>
                </section>
            </main>
        </div>
    );
};
