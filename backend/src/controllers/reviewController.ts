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