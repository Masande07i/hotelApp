import { useState } from "react";
import { Text } from "../../components/Text/text";
import { Button } from "../../components/button/button";

export const adminDashboard = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div>
            <Text variant="h1">Admin Dashboard</Text>

            <Text variant="h2">Manage Accommodations</Text>

            <Button
                label="Add Accommodation"
                onClick={() => setShowForm(!showForm)}
                type="button"
            />

            {showForm && (
                <div>
                    <Text variant="h2">New Accommodation</Text>
                </div>
            )}

            <Text variant="h2">Manage Reservations</Text>
        </div>
    );
};
