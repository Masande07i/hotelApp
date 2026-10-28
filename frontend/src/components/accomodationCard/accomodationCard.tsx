
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import {
    fetchAccommodationImages,
    deleteAccommodation
} from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { AccommodationPopup } from "../Popup/accommodationPopup";
import { Button } from "../button/button";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import styles from "./accomodationCard.module.css";

interface AccommodationCardProps extends Accommodation {}

export const AccommodationCard = ({
    id,
    name,
    description,
    address,
    city,
    country,
    star_rating,
    created_at,
    updated_at
}: AccommodationCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [showEditForm, setShowEditForm] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = useSelector(
        (state: RootState) => state.accommodation.imagesByAccommodation[id]
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

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${name}?`
        );

        if (!confirmed) return;

        await dispatch(deleteAccommodation(id));
    };

    const accommodation: Accommodation = {
        id,
        name,
        description,
        address,
        city,
        country,
        star_rating,
        created_at,
        updated_at
    };

    return (
        <>
            <tr>
                <td>
                    <div className={styles.imageContainer}>
                        {accommodationImages.length > 0 ? (
                            <img
                                src={accommodationImages[currentImageIndex]?.image_url}
                                alt={name}
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.noImage}>No image</div>
                        )}

                        {accommodationImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className={styles.previousImage}
                                    onClick={() =>
                                        setCurrentImageIndex(
                                            (currentImageIndex - 1 + accommodationImages.length) %
                                            accommodationImages.length
                                        )
                                    }
                                >
                                    <CiCircleChevLeft />
                                </button>

                                <button
                                    type="button"
                                    className={styles.nextImage}
                                    onClick={() =>
                                        setCurrentImageIndex(
                                            (currentImageIndex + 1) % accommodationImages.length
                                        )
                                    }
                                >
                                    <CiCircleChevRight />
                                </button>
                            </>
                        )}
                    </div>
                </td>

                <td>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.address}>{address}</div>
                </td>

                <td>{city}, {country}</td>

                <td>
                    <span className={styles.rating}>
                        {"★".repeat(Math.max(0, Math.min(5, Number(star_rating) || 0)))}
                    </span>
                    <span className={styles.ratingNumber}>
                        {star_rating ?? "N/A"}
                    </span>
                </td>

                <td>—</td>

                <td>
                    <div className={styles.actions}>
                        <Button
                            label="Edit"
                            onClick={() => setShowEditForm(true)}
                            type="button"
                            className={styles.editButton}
                        />

                        <Button
                            label="Delete"
                            onClick={handleDelete}
                            type="button"
                            className={styles.deleteButton}
                        />

                        <Button
                            label="View"
                            onClick={() => navigate(`/admin/accommodations/${id}`)}
                            type="button"
                            className={styles.viewButton}
                        />
                    </div>
                </td>
            </tr>

            {showEditForm && (
                <AccommodationPopup
                    accommodation={accommodation}
                    onClose={() => setShowEditForm(false)}
                />
            )}
        </>
    );
};
