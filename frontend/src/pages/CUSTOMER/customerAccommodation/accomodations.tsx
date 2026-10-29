import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchAccommodations } from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard";
import styles from "./accomodations.module.css";
import { fetchFavourites } from "../../../features/favouriteSlice";


export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { accommodations, loading, error } = useSelector(
        (state: RootState) => state.accommodation
    );

    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        dispatch(fetchAccommodations());

        if (token) {
            dispatch(fetchFavourites());
        }
    }, [dispatch, token]);

    if (loading) {
        return <Text variant="p">Loading accommodations...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }

    if (accommodations.length === 0) {
        return (
            <div className={styles.page}>
                <Button
                    type="button"
                    label="Back to Home"
                    onClick={() => navigate("/")}
                />

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
                    <Button
                        type="button"
                        label="Back to Home"
                        onClick={() => navigate("/")}
                    />

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
