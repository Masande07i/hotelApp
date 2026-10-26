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

export const hasCompletedBooking = async (
    user_id: number,
    accommodation_id: number
): Promise<boolean> => {
    const { rows } = await query(
        `SELECT id
         FROM bookings
         WHERE user_id = $1
         AND accommodation_id = $2
         AND status = 'confirmed'
         AND check_out <= CURRENT_DATE
         LIMIT 1`,
        [user_id, accommodation_id]
    );

    return rows.length > 0;
};