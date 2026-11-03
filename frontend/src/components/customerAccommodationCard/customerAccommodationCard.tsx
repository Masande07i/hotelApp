import {addFavourite,removeFavourite} from "../../features/favouriteSlice";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchAccommodationImages,setCurrentImageIndex } from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import { CiCircleChevRight } from "react-icons/ci";
import { FaHeart, FaStar  } from "react-icons/fa";
import styles from "./customerAccommodationCard.module.css";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineLocationCity } from "react-icons/md";

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

    
    const isFavourite = useSelector((state: RootState) =>state.favourite.favourites.some(
            (accommodation) => accommodation.id === id));

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[id]
    );
    const currentImageIndex = useSelector(
    (state: RootState) => state.accommodation.currentImageIndexes[id] ?? 0
);

    const accommodationImages = images ?? [];

    

    useEffect(() => {
        if (images === undefined) {
            dispatch(fetchAccommodationImages(id));
        }
    }, [dispatch, id, images]);

    const showNextImage = () => {
    dispatch(
        setCurrentImageIndex({
            accommodationId: id,
            index: (currentImageIndex + 1) % accommodationImages.length
        })
    );
};

    const handleFavourite = () => {
    if (isFavourite) {
        dispatch(removeFavourite(id));
    } else {
        dispatch(addFavourite(id));
    }
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

            <button
                type="button"
                className={styles.favouriteButton}
                onClick={handleFavourite}
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
                <FaHeart
                    className={isFavourite ? styles.activeHeart : ""}
                />
            </button>
        </div>

        <div className={styles.info}>
            <Text variant="h2">{name}</Text>

            <div className={styles.rating}>
                <FaStar />
                <Text variant="p">{star_rating ?? "Not rated"}</Text>
            </div>

            <div className={styles.location}>
                <CiLocationOn />
                <Text variant="p">{city}, {country}</Text>
            </div>

            <Text variant="p">
                {description || "Discover this accommodation on Havenly."}
            </Text>

            <div className={styles.location}>
                <MdOutlineLocationCity />
                <Text variant="p">{address}</Text>
            </div>
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
}