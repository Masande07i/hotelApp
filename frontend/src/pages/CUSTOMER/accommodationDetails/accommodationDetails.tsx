import { useNavigate, useParams } from "react-router-dom";
import styles from "./accommodationDetails.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchRoomsByAccommodation } from "../../../features/roomSlice";
import {
    fetchAccommodations,
    fetchAccommodationImages
} from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import {
    fetchReviewsByAccommodation,
} from "../../../features/reviewSlice";
import { AccommodationMap } from "../../../components/map/map";
import { Navbar } from "../../../components/navbar/navbar";
import { Button } from "../../../components/button/button";
import { Footer } from "../../../components/footer/footer";
import {
    FaMapMarkerAlt,
    FaStar,
    FaBed,
    FaUser,
    FaTags
} from "react-icons/fa";


export const AccommodationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { rooms, loading, error } = useSelector(
        (state: RootState) => state.room
    );

    const {
        accommodations,
        loading: accommodationLoading,
        error: accommodationError
    } = useSelector((state: RootState) => state.accommodation);

    const accommodation = accommodations.find(
        (item) => item.id === Number(id)
    );

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[Number(id)]
    );

    const { reviews } = useSelector(
        (state: RootState) => state.review
    );

    const user = useSelector(
        (state: RootState) => state.auth.user
    );


    const {
        loading: reviewLoading,
    } = useSelector((state: RootState) => state.review);

    useEffect(() => {
        if (accommodations.length === 0) {
            dispatch(fetchAccommodations());
        }
    }, [dispatch, accommodations.length]);

    useEffect(() => {
        if (id) {
            dispatch(fetchRoomsByAccommodation(Number(id)));
            dispatch(fetchAccommodationImages(Number(id)));
            dispatch(fetchReviewsByAccommodation(Number(id)));
        }
    }, [dispatch, id]);

    if (accommodationLoading && !accommodation) {
        return (
            <div className={styles.details}>
                <Button
                    type="button"
                    label="Back to Accommodations"
                    onClick={() => navigate("/accomodations")}
                />
                <Text variant="p">Loading accommodation details...</Text>
            </div>
        );
    }

    if (accommodationError || (!accommodation && !accommodationLoading)) {
        return (
            <div className={styles.details}>
                <Button
                    type="button"
                    label="Back to Accommodations"
                    onClick={() => navigate("/accomodations")}
                />
                <Text variant="p">
                    {accommodationError || "Accommodation not found."}
                </Text>
            </div>
        );
    }

    if (!accommodation) {
        return <Text variant="p">Loading accommodation details...</Text>;
    }

    return (
        <div className={styles.details}>
            <Navbar className={styles.detailsNavbar} />

            <main className={styles.content}>

                <div className={styles.topSection}>
                    <div className={styles.titleArea}>
                        <div>
                            <Text variant="h1">{accommodation.name}</Text>

                            <div className={styles.location}>
                                <FaMapMarkerAlt />
                                <Text variant="p">
                                    {accommodation.city}, {accommodation.country}
                                </Text>
                            </div>
                        </div>

                        <div className={styles.rating}>
                            <FaStar />
                            <Text variant="p">
                                {accommodation.star_rating
                                    ? `${accommodation.star_rating} Star Hotel`
                                    : "Not rated"}
                            </Text>
                        </div>
                    </div>

                    <div className={styles.gallery}>
                        {images && images.length > 0 ? (
                            <>
                                <div className={styles.mainImage}>
                                    <img
                                        src={images[0].image_url}
                                        alt={accommodation.name}
                                    />
                                </div>

                                {images.slice(1, 5).map((image, index) => (
                                    <div
                                        className={styles.galleryImage}
                                        key={image.id}
                                    >
                                        <img
                                            src={image.image_url}
                                            alt={`${accommodation.name} ${index + 2}`}
                                        />
                                    </div>
                                ))}

                                {images.length > 5 && (
                                    <div className={styles.moreImages}>
                                        <img
                                            src={images[5].image_url}
                                            alt={`${accommodation.name} view`}
                                        />

                                        <span>
                                            +{images.length - 5} more photos
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.noImages}>
                                <Text variant="p">
                                    No images available
                                </Text>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.mainGrid}>

                    <div className={styles.leftColumn}>

                        <section className={styles.about}>
                            <Text variant="h2">About this accommodation</Text>

                            <Text variant="p">
                                {accommodation.description}
                            </Text>
                        </section>

                        <section className={styles.infoCards}>
                            <div className={styles.infoCard}>
                                <FaMapMarkerAlt />
                                <div>
                                    <Text variant="h2">Location</Text>
                                    <Text variant="p">
                                        {accommodation.address}, {accommodation.city}
                                    </Text>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <FaStar />
                                <div>
                                    <Text variant="h2">Rating</Text>
                                    <Text variant="p">
                                        {accommodation.star_rating
                                            ? `${accommodation.star_rating} out of 5`
                                            : "Not rated"}
                                    </Text>
                                </div>
                            </div>
                        </section>

                        <section className={styles.roomsSection}>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <Text variant="h1">Choose your room</Text>
                                    <Text variant="p">
                                        Select a room that suits your stay.
                                    </Text>
                                </div>
                            </div>

                            {loading ? (
                                <div className={styles.message}>
                                    <Text variant="p">Loading rooms...</Text>
                                </div>
                            ) : error ? (
                                <div className={styles.message}>
                                    <Text variant="p">{error}</Text>
                                </div>
                            ) : rooms.length === 0 ? (
                                <div className={styles.message}>
                                    <Text variant="p">
                                        No rooms available for this accommodation.
                                    </Text>
                                </div>
                            ) : (
                                <div className={styles.rooms}>
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className={styles.room}
                                        >
                                            <div className={styles.roomInfo}>
                                                <Text variant="h2">
                                                    {room.room_type}
                                                </Text>

                                                <Text variant="p">
                                                    {room.description ??
                                                        "No description available"}
                                                </Text>

                                                <div className={styles.roomDetails}>
                                                    <span>
                                                        <FaBed />{" "}
                                                        {room.bed_type ??
                                                            "Not specified"}
                                                    </span>

                                                    <span>
                                                        <FaUser /> Sleeps {room.capacity}
                                                    </span>

                                                    <span>
                                                        <FaTags />{" "}
                                                        {room.amenities?.join(", ") ||
                                                            "No amenities listed"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.roomBooking}>
                                                <div>
                                                    <Text variant="p">
                                                        From
                                                    </Text>

                                                    <Text variant="h2">
                                                        R{room.price_per_night}
                                                    </Text>

                                                    <Text variant="p">
                                                        per night
                                                    </Text>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={styles.bookButton}
                                                    onClick={() => {
                                                        if (!user) {
                                                            navigate("/login", {
                                                                state: {
                                                                    from: `/accommodations/${accommodation.id}`
                                                                }
                                                            });

                                                            return;
                                                        }

                                                        navigate("/booking", {
                                                            state: {
                                                                accommodation,
                                                                room
                                                            }
                                                        });
                                                    }}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className={styles.locationSection}>
                            <Text variant="h2">Where you'll stay</Text>

                            {accommodation.latitude !== null &&
                            accommodation.longitude !== null ? (
                                <AccommodationMap
                                    latitude={Number(accommodation.latitude)}
                                    longitude={Number(accommodation.longitude)}
                                    name={accommodation.name}
                                />
                            ) : (
                                <Text variant="p">
                                    Location map not available.
                                </Text>
                            )}
                        </section>

                        <section className={styles.reviewsSection}>
                            <div className={styles.sectionHeading}>
                                <div>
                                    <Text variant="h2">Guest reviews</Text>

                                    <Text variant="p">
                                        What previous guests have said.
                                    </Text>
                                </div>
                            </div>

                            {reviewLoading ? (
                                <Text variant="p">Loading reviews...</Text>
                            ) : reviews.length === 0 ? (
                                <div className={styles.noReviews}>
                                    <Text variant="p">
                                        No reviews yet. Be the first to review
                                        this accommodation!
                                    </Text>
                                </div>
                            ) : (
                                <div className={styles.reviews}>
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className={styles.review}
                                        >
                                            <div className={styles.reviewTop}>
                                                <div>
                                                    <Text variant="h2">
                                                        {review.user_name}
                                                    </Text>

                                                    <Text variant="span">
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleDateString()}
                                                    </Text>
                                                </div>

                                                <div className={styles.reviewRating}>
                                                    <FaStar /> {review.rating}/5
                                                </div>
                                            </div>

                                            <Text variant="p">
                                                {review.comment}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};