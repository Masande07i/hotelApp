
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaMapMarkerAlt, FaRegImage } from "react-icons/fa";
import type { AppDispatch, RootState } from "../../../store/store";
import {
    fetchAccommodations,
    fetchAccommodationImages
} from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import styles from "./accommodationShare.module.css";
import { Footer } from "../../../components/footer/footer";

export const AccommodationShare = () => {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { accommodations, loading, error } = useSelector(
        (state: RootState) => state.accommodation
    );

    const accommodation = accommodations.find(
        (item) => item.id === Number(id)
    );

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[Number(id)]
    );

    useEffect(() => {
        if (accommodations.length === 0) {
            dispatch(fetchAccommodations());
        }
    }, [dispatch, accommodations.length]);

    useEffect(() => {
        if (id) {
            dispatch(fetchAccommodationImages(Number(id)));
        }
    }, [dispatch, id]);

    if (loading && !accommodation) {
        return (
            <div className={styles.message}>
                <Text variant="p">Loading accommodation...</Text>
            </div>
        );
    }

    if (error || !accommodation) {
        return (
            <div className={styles.message}>
                <Text variant="h2">Accommodation not found</Text>
                <Button
                    label="Visit Havenly"
                    type="button"
                    onClick={() => navigate("/")}
                />
            </div>
        );
    }

    return (
        <div className={styles.sharePage}>
            <header className={styles.header}>
                Havenly
            </header>

            <main className={styles.content}>
                <div className={styles.gallery}>
                    {images && images.length > 0 ? (
                        <>
                            <img
                                src={images[0].image_url}
                                alt={accommodation.name}
                                className={styles.mainImage}
                            />

                            <div className={styles.otherImages}>
                                {images.slice(1, 5).map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.image_url}
                                        alt={accommodation.name}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.noImages}>
                            <FaRegImage size={40} />
                            <Text variant="p">No images available</Text>
                        </div>
                    )}
                </div>

                <section className={styles.details}>
                    <div className={styles.titleArea}>
                        <Text variant="h1">{accommodation.name}</Text>

                        <span className={styles.rating}>
                            <FaStar />
                            {" "}{accommodation.star_rating} Star Rating
                        </span>
                    </div>

                    <div className={styles.location}>
                        <FaMapMarkerAlt />
                        {" "}{accommodation.city}, {accommodation.country}
                    </div>

                    <div className={styles.description}>
                        <Text variant="p">
                            {accommodation.description}
                        </Text>
                    </div>

                    <div className={styles.address}>
                        <Text variant="p">
                            Address: {accommodation.address}
                        </Text>
                    </div>

                    <div className={styles.visitSection}>
                        <Button
                            label="View Accommodation on Havenly"
                            type="button"
                            onClick={() =>
                                navigate(`/accommodations/${accommodation.id}`)
                            }
                        />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
