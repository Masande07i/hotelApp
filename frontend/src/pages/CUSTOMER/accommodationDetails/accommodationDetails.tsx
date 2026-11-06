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
    fetchReviewsByAccommodation,} from "../../../features/reviewSlice";
import { AccommodationMap } from "../../../components/map/map";
import { navbar as Navbar } from "../../../components/navbar/navbar";
import { Button } from "../../../components/button/button";
import { Footer } from "../../../components/footer/footer";


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

            <Text variant="h1">{accommodation.name}</Text>


            <div className={styles.gallery}>
                {images?.map((image) => (
                    <img
                        key={image.id}
                        src={image.image_url}
                        alt={accommodation.name}
                    />
                ))}
            </div>

            
            <Text variant="p">
                {accommodation.address}, {accommodation.city},{" "}
                {accommodation.country}
            </Text>

            <Text variant="p">
                 {accommodation.star_rating ?? "Not rated"}
            </Text>

            <Text variant="h2">About this accommodation</Text>
            <Text variant="p">{accommodation.description}</Text>

            <hr />

            <Text variant="h1">Select your room</Text>

            {loading ? (
                <Text variant="p">Loading rooms...</Text>
            ) : error ? (
                <Text variant="p">{error}</Text>
            ) : rooms.length === 0 ? (
                <Text variant="p">
                    No rooms available for this accommodation.
                </Text>
            ) : (
                rooms.map((room) => (
                    <div key={room.id} className={styles.room}>
                        <div>
                            <Text variant="h2">{room.room_type}</Text>

                            <Text variant="p">
                                {room.description ?? "No description available"}
                            </Text>

                            <Text variant="p">
                                Bed type: {room.bed_type ?? "Not specified"}
                            </Text>

                            <Text variant="p">
                                Sleeps {room.capacity} guests
                            </Text>

                            <Text variant="p">
                                Amenities: {room.amenities?.join(", ") || "None listed"}
                            </Text>
                        </div>

                        <div className={styles.roomPrice}>
                            <Text variant="h2">
                                R{room.price_per_night}
                            </Text>

                            <Text variant="p">per night</Text>

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
                                        state: { accommodation, room }
                                    });
                                }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))
            )}

            <hr />

            <Text variant="h2">Location</Text>

            {accommodation.latitude !== null &&
            accommodation.longitude !== null ? (
                <AccommodationMap
                    latitude={Number(accommodation.latitude)}
                    longitude={Number(accommodation.longitude)}
                    name={accommodation.name}
                />
            ) : (
                <Text variant="p">Location map not available.</Text>
            )}

           

            <Text variant="h1">Customer Reviews</Text>

            {reviewLoading ? (
                <Text variant="p">Loading reviews...</Text>
            ) : reviews.length === 0 ? (
                <Text variant="p">
                    No reviews yet. Be the first to review this accommodation!
                </Text>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className={styles.review}>
                        <Text variant="h2">{review.user_name}</Text>
                        <Text variant="h2">Rating: {review.rating}/5</Text>
                        <Text variant="p">{review.comment}</Text>
                        <Text variant="span">
                            {new Date(review.created_at).toLocaleDateString()}
                        </Text>
            
                    </div>
                ))
            )}
            <Footer />
        </div>
    );
};
