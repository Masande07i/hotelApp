
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
    fetchAccommodations,
    openAccommodationForm,
    closeAccommodationForm,
    updateAccommodationInputs
} from "../../features/accomodationSlice";
import { Text } from "../../components/Text/text";
import { Button } from "../../components/button/button";
import { AccommodationCard } from "../../components/accomodationCard/accomodationCard";
import { AccommodationPopup } from "../../components/Popup/accommodationPopup/accommodationPopup";

export const AdminAccommodations = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        accommodations,
        loading,
        error,
        showForm
    } = useSelector((state: RootState) => state.accommodation);

    useEffect(() => {
        dispatch(fetchAccommodations());
    }, [dispatch]);

    const handleAddAccommodation = () => {
        dispatch(updateAccommodationInputs({
            name: "",
            description: "",
            address: "",
            city: "",
            country: "",
            star_rating: ""
        }));

        dispatch(openAccommodationForm());
    };

    if (loading) {
        return <Text>Loading accommodations...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }

    return (
        <div>
            <Text variant="h1">Manage Accommodations</Text>

            <Button
                label="Add Accommodation"
                onClick={handleAddAccommodation}
                type="button"
            />

            {showForm && (
                <AccommodationPopup
                    onClose={() => dispatch(closeAccommodationForm())}
                />
            )}

            {accommodations.map((accommodation) => (
                <AccommodationCard
                    key={accommodation.id}
                    {...accommodation}
                />
            ))}
        </div>
    );
};
