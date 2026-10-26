import { query } from "../config/database";
import { Review } from "../types/review.types"

export const getReviewsByAccommodation = async (
    accommodation_id: number
): Promise<Review[]> => {
    const { rows } = await query(
        `SELECT * FROM reviews
         WHERE accommodation_id = $1
         ORDER BY created_at DESC`,
        [accommodation_id]
    );

    return rows;
};