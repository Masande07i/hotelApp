import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchAccommodations } from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard";
import styles from "./accomodations.module.css"

export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accommodations, loading, error } = useSelector(
        (state: RootState) => state.accommodation
    );

    useEffect(() => {
        dispatch(fetchAccommodations());
    }, [dispatch]);

    if (loading) {
        return <Text variant="p">Loading accommodations...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }
    if (accommodations.length === 0) {
    return (
        <div className={styles.page}>
            <Text variant="h2">No accommodations available</Text>
            <Text variant="p">
                Please check back later for available stays.
            </Text>
        </div>
    );
}

    return (
        <div className={styles.page}>
            <div className={styles.heading}>
                <div>
                    <Text variant="h1">Explore Accommodations</Text>
                    <Text variant="p">
                        Find the perfect place for your next stay.
                    </Text>
                </div>

                <Text variant="p">
                    {accommodations.length} accommodations found
                </Text>
            </div>

            <div className={styles.listings}>
                {accommodations.map((accommodation) => (
                    <CustomerAccommodationCard
                        key={accommodation.id}
                        {...accommodation}
                    />
                ))}
            </div>
        </div>
    );
};
