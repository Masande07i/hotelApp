import { Request, Response } from "express";
import {getReviewsByAccommodation,hasCompletedBooking,createReview,
    updateReview,
    deleteReview
} from "../services/reviewService";


export const getAccommodationReviews = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const accommodation_id = Number(req.params.accommodation_id);

        if (!Number.isInteger(accommodation_id) || accommodation_id <= 0) {
            res.status(400).json({ message: "Invalid accommodation ID" });
            return;
        }

        const reviews = await getReviewsByAccommodation(accommodation_id);

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

export const addReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user_id = req.user!.id;
        const accommodation_id = Number(req.params.accommodation_id);
        const { rating, comment } = req.body;

        if (!Number.isInteger(accommodation_id) || accommodation_id <= 0) {
            res.status(400).json({ message: "Invalid accommodation ID" });
            return;
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }

        if (!comment || !comment.trim()) {
            res.status(400).json({ message: "Comment is required" });
            return;
        }

        const eligible = await hasCompletedBooking(user_id, accommodation_id);

        if (!eligible) {
            res.status(403).json({
                message: "You can only review an accommodation after completing a confirmed booking."
            });
            return;
        }

        const review = await createReview(
            user_id,
            accommodation_id,
            rating,
            comment.trim()
        );

        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Failed to add review" });
    }
};

export const editReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user_id = req.user!.id;
        const accommodation_id = Number(req.params.accommodation_id);
        const { rating, comment } = req.body;

        if (!Number.isInteger(accommodation_id) || accommodation_id <= 0) {
            res.status(400).json({ message: "Invalid accommodation ID" });
            return;
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }

        if (!comment || !comment.trim()) {
            res.status(400).json({ message: "Comment is required" });
            return;
        }

        const eligible = await hasCompletedBooking(user_id, accommodation_id);

        if (!eligible) {
            res.status(403).json({
                message: "You can only update a review if you have completed a confirmed booking."
            });
            return;
        }

        const review = await updateReview(
            user_id,
            accommodation_id,
            rating,
            comment.trim()
        );

        if (!review) {
            res.status(404).json({ message: "Review not found" });
            return;
        }

        res.status(200).json({
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Failed to update review" });
    }
};

