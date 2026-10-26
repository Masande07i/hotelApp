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

export const createReview = async (
    user_id: number,
    accommodation_id: number,
    rating: number,
    comment: string
): Promise<Review> => {
    const { rows } = await query(
        `INSERT INTO reviews (
            user_id,
            accommodation_id,
            rating,
            comment
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user_id, accommodation_id, rating, comment]
    );

    return rows[0];
};

export const updateReview = async (
    user_id: number,
    accommodation_id: number,
    rating: number,
    comment: string
): Promise<Review | null> => {
    const { rows } = await query(
        `UPDATE reviews
         SET rating = $1,
             comment = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3
         AND accommodation_id = $4
         RETURNING *`,
        [rating, comment, user_id, accommodation_id]
    );

    return rows[0] || null;
};