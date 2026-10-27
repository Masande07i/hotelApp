
import { query } from "../config/database";
import { Payment } from "../types/payment.types";

export const createPayment = async (
    booking_id: number,
    amount: number,
    payment_reference: string
): Promise<Payment> => {
    const { rows } = await query(
        `INSERT INTO payments (
            booking_id,
            amount,
            payment_reference,
            payment_status,
            payment_method
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            booking_id,
            amount,
            payment_reference,
            "pending",
            "PayFast"
        ]
    );

    return rows[0];
};



export const getBookingForPayment = async (
    booking_id: number,
    user_id: number
) => {
    const { rows } = await query(
        `SELECT
            b.id,
            b.user_id,
            b.total_price,
            b.status,
            u.name,
            u.email
         FROM bookings b
         JOIN users u ON b.user_id = u.id
         WHERE b.id = $1
         AND b.user_id = $2
         AND b.status = 'pending'`,
        [booking_id, user_id]
    );

    return rows[0] ?? null;
};
