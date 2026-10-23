
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAccommodationImages } from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import { CiCircleChevRight } from "react-icons/ci";
import styles from "./customerAccommodationCard.module.css";

interface CustomerAccommodationCardProps extends Accommodation {}

export const CustomerAccommodationCard = ({
    id,
    name,
    description,
    address,
    city,
    country,
    star_rating
}: CustomerAccommodationCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[id]
    );

    const accommodationImages = images ?? [];

    useEffect(() => {
        if (images === undefined) {
            dispatch(fetchAccommodationImages(id));
        }
    }, [dispatch, id, images]);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    const showNextImage = () => {
        setCurrentImageIndex(
            (currentImageIndex + 1) % accommodationImages.length
        );
    };

    return (
        <article className={styles.card}>
            <div className={styles.gallery}>
                {accommodationImages.length > 0 ? (
                    <img
                        className={styles.accommodationImage}
                        src={accommodationImages[currentImageIndex]?.image_url}
                        alt={name}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        No image available
                    </div>
                )}

                {accommodationImages.length > 1 && (
                    <button
                        type="button"
                        className={styles.nextImage}
                        onClick={showNextImage}
                        aria-label="Next image"
                    >
                        <CiCircleChevRight />
                    </button>
                )}
            </div>

            <div className={styles.info}>
                <Text variant="h2">{name}</Text>

                <Text variant="p">
                    {city}, {country}
                </Text>

                <Text variant="p">{address}</Text>

                <div className={styles.rating}>
                    <span>★</span>
                    <Text variant="p">
                        {star_rating ?? "Not rated"}
                    </Text>
                </div>

                <Text variant="p">
                    {description || "Discover this accommodation on Havenly."}
                </Text>
            </div>

            <div className={styles.actions}>
                <Button
                    label="View Details"
                    onClick={() => navigate(`/accommodations/${id}`)}
                    type="button"
                />
            </div>
        </article>
    );
};
