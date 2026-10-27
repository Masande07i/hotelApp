import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAccommodations, fetchAccommodationImages } from "../../features/accomodationSlice";
import { Text } from "../Text/text";
import styles from "./popularAccommodations.module.css";
import { useNavigate } from "react-router-dom";

export const popularAccommodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

    const imagesByAccommodation = useSelector(
        (state: RootState) => state.accommodation.imagesByAccommodation
    );

    useEffect(() => {
        if (accommodations.length === 0) {
            dispatch(fetchAccommodations());
        }
    }, [dispatch, accommodations.length]);

useEffect(() => {
    accommodations.forEach((accommodation) => {
        if (imagesByAccommodation[accommodation.id] === undefined) {
            dispatch(fetchAccommodationImages(accommodation.id));
        }
    });
}, [dispatch, accommodations, imagesByAccommodation]);


return (
    <section className={styles.section}>
        <div className={styles.heading}>
            <Text variant="h2">Popular Accommodations</Text>
        </div>

        <div className={styles.listings}>
            {accommodations.map((accommodation) => {
                const images = imagesByAccommodation[accommodation.id] ?? [];

                return (
                    <div
                        className={styles.card}
                        key={accommodation.id}
                        onClick={() => navigate(`/accommodations/${accommodation.id}`)}
                    >
                        {images.length > 0 && (
                            <img
                                className={styles.image}
                                src={images[0].image_url}
                                alt={accommodation.name}
                            />
                        )}

                        <div className={styles.name}>
                            <Text variant="h2">{accommodation.name}</Text>
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);
}