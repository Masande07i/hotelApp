
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store/store";
import {
    updateReviewInputs,
    clearReviewForm,
    addReview
} from "../../../features/reviewSlice";
import { useEffect } from "react";
import { Text } from "../../../components/Text/text";

export const WriteReview = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { accommodation_id } = useParams();

    const inputs = useSelector((state: RootState) => state.review.inputs);
    const loading = useSelector((state: RootState) => state.review.loading);
    const error = useSelector((state: RootState) => state.review.error);
    const success = useSelector((state: RootState) => state.review.success);

    useEffect(() => {
        dispatch(clearReviewForm());
    }, [dispatch]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!accommodation_id) {
            return;
        }

        const result = await dispatch(
            addReview({
                accommodation_id: Number(accommodation_id),
                inputs
            })
        );

        if (addReview.fulfilled.match(result)) {
            navigate("/profile");
        }
    };

    return (
        <div>
            <Text variant="h1">Write a Review</Text>

            <form onSubmit={handleSubmit}>
                <label htmlFor="rating">Rating</label>
                <select
                    id="rating"
                    value={inputs.rating}
                    onChange={(event) =>
                        dispatch(updateReviewInputs({
                            rating: Number(event.target.value)
                        }))
                    }
                >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                </select>

                <label htmlFor="comment">Your review</label>
                <textarea
                    id="comment"
                    value={inputs.comment}
                    onChange={(event) =>
                        dispatch(updateReviewInputs({
                            comment: event.target.value
                        }))
                    }
                    placeholder="Share your experience..."
                    required
                />

                {error && <p>{error}</p>}
                {success && <p>Review submitted successfully!</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Review"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
