import { useState } from "react";
import { Link } from "react-router-dom";
import { Text } from "../../components/Text/text";
import { Button } from "../../components/button/button";
import { AccommodationPopup } from "../../components/Popup/accommodationPopup/accommodationPopup";

export const adminDashboard = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <Text variant="h1">Admin Dashboard</Text>

            <Text variant="h2">Manage Accommodations</Text>

            <Text variant="h2">Manage Accommodations</Text>

                <Link to="/admin/accommodations">
                    Manage Accommodations
                </Link>
            <Button
                label="Add Accommodation"
                onClick={() => setShowForm(!showForm)}
                type="button"
            />

            {showForm && (
                <AccommodationPopup
                    onClose={() => setShowForm(false)}
                />
            )}

            <Text variant="h2">Manage Reservations</Text>
        </div>
    );
};
