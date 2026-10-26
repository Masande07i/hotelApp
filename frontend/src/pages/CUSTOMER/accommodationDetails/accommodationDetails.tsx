import { useNavigate } from "react-router-dom";
import styles from "./accommodationDetails.module.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchRoomsByAccommodation } from "../../../features/roomSlice";
import {
    fetchAccommodations,
    fetchAccommodationImages
} from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { fetchReviewsByAccommodation,updateReviewInputs,addReview,removeReview,startEditing,updateReview, clearReviewForm } from "../../../features/reviewSlice"

export const AccommodationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { rooms, loading, error } = useSelector(
        (state: RootState) => state.room
    );

    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

    const accommodation = accommodations.find(
        (item) => item.id === Number(id)
    );

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[Number(id)]
    );
    const { reviews} = useSelector(
    (state: RootState) => state.review
    );
    const user = useSelector(
    (state: RootState) => state.auth.user
    );
    const userReview = reviews.find(
    (review) => review.user_id === user?.id
    );
    const { inputs: reviewInputs, error: reviewError, success: reviewSuccess,editing } = useSelector(
    (state: RootState) => state.review
    );

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

    if (!accommodation) {
        return <Text variant="p">Loading accommodation details...</Text>;
    }

    return (
        <div className={styles.details}>
            <Text variant="h1">{accommodation.name}</Text>

            <Text variant="p">
                {accommodation.address}, {accommodation.city},{" "}
                {accommodation.country}
            </Text>

            <Text variant="p">
                Rating: {accommodation.star_rating ?? "Not rated"}
            </Text>

            <div className={styles.gallery}>
                {images?.map((image) => (
                    <img
                        key={image.id}
                        src={image.image_url}
                        alt={accommodation.name}
                    />
                ))}
            </div>

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
                                    onClick={() =>
                                        navigate("/booking", {
                                            state: {
                                                accommodation,
                                                room } })}>
                                    Book Now
                                </button>
                                
                        </div>
                        
                        
                    </div>
                    
                    
                )))}
            <hr />

            {user && !userReview && (
                <div className={styles.reviewForm}>
                    <Text variant="h2">
                        {editing ? "Edit Your Review" : "Write a Review"}
                    </Text>
                    <label>Rating</label>
                    <label>Comment</label>

                    <textarea
                        value={reviewInputs.comment}
                        onChange={(e) =>
                            dispatch(updateReviewInputs({
                                comment: e.target.value
                            }))
                        }
                        placeholder="Share your experience..."
                    />
                 

                    <select
                        value={reviewInputs.rating}
                        onChange={(e) =>
                            dispatch(updateReviewInputs({
                                rating: Number(e.target.value)
                            }))
                        }
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={3}>3 - Good</option>
                        <option value={2}>2 - Fair</option>
                        <option value={1}>1 - Poor</option>
                    </select>

                       <button
                            type="button"
                            onClick={() => {
                                if (id) {
                                    if (editing) {
                                        dispatch(updateReview({
                                            accommodation_id: Number(id),
                                            inputs: reviewInputs
                                        }));
                                    } else {
                                        dispatch(addReview({
                                            accommodation_id: Number(id),
                                            inputs: reviewInputs
                                        }));
                                    }
                                }
                            }}
                        >
                            {editing ? "Update Review" : "Submit Review"}
                        </button>

                    {reviewError && (
                        <Text variant="p">{reviewError}</Text>
                    )}
                    {reviewSuccess && (
                            <Text variant="p">Your review has been submitted successfully!</Text>
                        )}
             
                 </div>
            )}
                <Text variant="h1">Customer Reviews</Text>

                {reviews.length === 0 ? (
                    <Text variant="p">No reviews yet. Be the first to review this accommodation!</Text>
                ) : (
                    
                    reviews.map((review) => (
                        <div key={review.id} className={styles.review}>
                            <Text variant="h2">Rating: {review.rating}/5</Text>
                            <Text variant="p">{review.comment}</Text>
                            <Text variant="span">
                                {new Date(review.created_at).toLocaleDateString()}
                            </Text>
                            {user && review.user_id === user.id && (
                            <button
                                type="button"
                                onClick={() => {
                                    dispatch(updateReviewInputs({
                                        rating: review.rating,
                                        comment: review.comment
                                    }));
                                    dispatch(startEditing());
                                }} >
                                Edit
                            </button>
                        )}
                        {user && review.user_id === user.id && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (id) {
                                        dispatch(removeReview(Number(id)));
                                    }
                                }}
                            >
                                Delete
                            </button>
                        )}
                     {editing && (
                            <button
                                type="button"
                                onClick={() => dispatch(clearReviewForm())}
                            >
                                Cancel
                            </button>
                        )}
                </div>
                    ))
                )}
        </div>
    );
};
