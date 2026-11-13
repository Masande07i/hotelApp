import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../store/store";
import { fetchAccommodations } from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";

import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard";
import styles from "./accomodations.module.css";
import { fetchFavourites } from "../../../features/favouriteSlice";
import {  Navbar } from "../../../components/navbar/navbar";
import { Footer } from "../../../components/footer/footer";

export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams] = useSearchParams();

    const destination = searchParams.get("destination");

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

    const filteredAccommodations = destination
        ? accommodations.filter(
            (accommodation) =>
                accommodation.city.toLowerCase().trim() === destination.toLowerCase().trim()
        )
        : accommodations;

    if (loading) {
        return <Text variant="p">Loading accommodations...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }

    if (filteredAccommodations.length === 0) {
        return (
            <div className={styles.page}>
                <Navbar className={styles.detailsNavbar} />
                <Text variant="h2">
                    No accommodations found in {destination}
                </Text>
                <Text variant="p">
                    Please try searching for another city.
                </Text>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Navbar className={styles.detailsNavbar} />

            <div className={styles.heading}>
                <div>
                    <Text variant="h1">Explore Accommodations</Text>
                    <Text variant="p">
                        {destination
                            ? `Available accommodations in ${destination}.`
                            : "Find the perfect place for your next stay."}
                    </Text>
                </div>

                <Text variant="p">
                    {filteredAccommodations.length} accommodations found
                </Text>
            </div>

            <div className={styles.listings}>
                {filteredAccommodations.map((accommodation) => (
                    <CustomerAccommodationCard
                        key={accommodation.id}
                        {...accommodation}
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
};
