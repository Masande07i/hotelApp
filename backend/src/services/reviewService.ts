import { query } from "../config/database";
import { Review } from "../types/review.types"

export const getReviewsByAccommodation = async (
    accommodation_id: number
): Promise<Review[]> => {
    const { rows } = await query(
        `SELECT 
            reviews.*,
            users.name AS user_name
         FROM reviews
         JOIN users ON reviews.user_id = users.id
         WHERE reviews.accommodation_id = $1
         ORDER BY reviews.created_at DESC`,
        [accommodation_id]
    );

    return rows;
};

export const hasCompletedBooking = async (
    user_id: number,
    accommodation_id: number
): Promise<boolean> => {
    const { rows } = await query(
        `SELECT bookings.id
         FROM bookings
         JOIN booking_rooms ON bookings.id = booking_rooms.booking_id
         JOIN rooms ON booking_rooms.room_id = rooms.id
         WHERE bookings.user_id = $1
         AND rooms.accommodation_id = $2
         AND bookings.status = 'confirmed'
         AND bookings.check_out <= CURRENT_DATE
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
export const deleteReview = async (
    user_id: number,
    accommodation_id: number
): Promise<Review | null> => {
    const { rows } = await query(
        `DELETE FROM reviews
         WHERE user_id = $1
         AND accommodation_id = $2
         RETURNING *`,
        [user_id, accommodation_id]
    );

    return rows[0] || null;
};