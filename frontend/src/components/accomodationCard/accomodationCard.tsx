import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import {
    fetchAccommodationImages,
    deleteAccommodation,
    setCurrentImageIndex,
    openEditAccommodationForm,
    closeEditAccommodationForm
} from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { AccommodationPopup } from "../Popup/accommodationPopup";
import { Button } from "../button/button";
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
    latitude,
    longitude,
    total_rooms,
    created_at,
    updated_at
}: AccommodationCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const images = useSelector(
        (state: RootState) => state.accommodation.imagesByAccommodation[id]
    );

    const currentImageIndex = useSelector(
        (state: RootState) =>
            state.accommodation.currentImageIndexes[id] ?? 0
    );

    const showEditForm = useSelector(
        (state: RootState) =>
            state.accommodation.showEditForms[id] ?? false
    );

    const accommodationImages = images ?? [];

    useEffect(() => {
        if (images === undefined) {
            dispatch(fetchAccommodationImages(id));
        }
    }, [dispatch, id, images]);

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
        latitude,
        longitude,
        total_rooms,
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
                                        dispatch(
                                            setCurrentImageIndex({
                                                accommodationId: id,
                                                index:
                                                    (currentImageIndex - 1 + accommodationImages.length) %
                                                    accommodationImages.length
                                            })
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className={styles.nextImage}
                                    onClick={() =>
                                        dispatch(
                                            setCurrentImageIndex({
                                                accommodationId: id,
                                                index:
                                                    (currentImageIndex + 1) %
                                                    accommodationImages.length
                                            })
                                        )
                                    }
                                />
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
                        {"★".repeat(
                            Math.max(0, Math.min(5, Number(star_rating) || 0))
                        )}
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
                            onClick={() =>
                                dispatch(openEditAccommodationForm(id))
                            }
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
                            onClick={() =>
                                navigate(`/admin/accommodations/${id}`)
                            }
                            type="button"
                            className={styles.viewButton}
                        />
                    </div>
                </td>
            </tr>

            {showEditForm && (
                <AccommodationPopup
                    accommodation={accommodation}
                    onClose={() =>
                        dispatch(closeEditAccommodationForm(id))
                    }
                />
            )}
        </>
    );
};
