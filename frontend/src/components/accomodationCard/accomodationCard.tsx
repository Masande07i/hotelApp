import { useEffect, useState } from "react";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
    fetchAccommodationImages,
    deleteAccommodation
} from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { AccommodationPopup } from "../Popup/accommodationPopup/accommodationPopup";
import { useNavigate } from "react-router-dom";

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
    const [showEditForm, setShowEditForm] = useState(false);
    const navigate = useNavigate();
    const images = useSelector(
        (state: RootState) => state.accommodation.imagesByAccommodation[id]
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
        created_at,
        updated_at
    };

    return (
        <div>
            <div className="accommodation-gallery">
                {accommodationImages.map((image) => (
                    <img
                        key={image.id}
                        src={image.image_url}
                        alt={name}
                        width="300"
                    />
                ))}
            </div>

            <Text variant="h2">{name}</Text>
            <Text variant="p">{description}</Text>
            <Text variant="p">{address}</Text>
            <Text variant="p">{city}, {country}</Text>
            <Text variant="p">
                Rating: {star_rating ?? "Not rated"}
            </Text>

            <Button
                label="Edit Accommodation"
                onClick={() => setShowEditForm(true)}
                type="button"
            />

            <Button
                label="Delete Accommodation"
                onClick={handleDelete}
                type="button"
            />

           <Button
                label="View Details"
                onClick={() => navigate(`/accommodations/${id}`)}
                type="button"
            />

            {showEditForm && (
                <AccommodationPopup
                    accommodation={accommodation}
                    onClose={() => setShowEditForm(false)}
                />
            )}
           
        </div>
    );
};
