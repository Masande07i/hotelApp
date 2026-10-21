import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAccommodationImages } from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import {  CiCircleChevRight } from "react-icons/ci";

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

    const showNextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % accommodationImages.length);
    };

   

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    return (
        <div>
            <div className="accommodation-gallery">
                {accommodationImages.length > 0 && (
                    <>
                        <img
                            src={accommodationImages[currentImageIndex]?.image_url}
                            alt={name}
                            width="300"
                        />

                        {accommodationImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showNextImage}
                                    aria-label="Next image"
                                >
                                    <CiCircleChevRight />
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>

            <Text variant="h2">{name}</Text>
            <Text variant="p">{description}</Text>
            <Text variant="p">{address}</Text>
            <Text variant="p">
                {city}, {country}
            </Text>
            <Text variant="p">
                Rating: {star_rating ?? "Not rated"}
            </Text>

            <Button
                label="View Details"
                onClick={() => navigate(`/accommodations/${id}`)}
                type="button"
            />
        </div>
    );
};
