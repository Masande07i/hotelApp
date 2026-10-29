import { query, getClient } from "../config/database";
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
            "Paystack"
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

export const getPaymentByReference = async (
    payment_reference: string
): Promise<Payment | null> => {
    const { rows } = await query(
        `SELECT *
         FROM payments
         WHERE payment_reference = $1`,
        [payment_reference]
    );

    return rows[0] ?? null;
};

export const updatePaymentStatus = async (
    payment_reference: string,
    payment_status: Payment["payment_status"]
): Promise<Payment | null> => {
    const { rows } = await query(
        `UPDATE payments
         SET payment_status = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE payment_reference = $2
         RETURNING *`,
        [payment_status, payment_reference]
    );

    return rows[0] ?? null;
};

export const verifyPaymentAmount = async (
    payment_reference: string,
    amount: number
): Promise<boolean> => {
    const { rows } = await query(
        `SELECT amount
         FROM payments
         WHERE payment_reference = $1`,
        [payment_reference]
    );

    if (!rows[0]) {
        return false;
    }

    return Math.abs(
        Math.round(Number(rows[0].amount) * 100) - amount
    ) <= 1;
};

export const completePayment = async (
    payment_reference: string,
    booking_id: number
): Promise<void> => {
    const client = await getClient();

    try {
        await client.query("BEGIN");

        const paymentResult = await client.query(
            `UPDATE payments
             SET payment_status = 'paid',
                 updated_at = CURRENT_TIMESTAMP
             WHERE payment_reference = $1
             AND booking_id = $2
             AND payment_status = 'pending'`,
            [payment_reference, booking_id]
        );

        if (paymentResult.rowCount !== 1) {
            throw new Error("Payment could not be updated");
        }

        const bookingResult = await client.query(
            `UPDATE bookings
             SET status = 'confirmed',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             AND status = 'pending'`,
            [booking_id]
        );

        if (bookingResult.rowCount !== 1) {
            throw new Error("Booking could not be confirmed");
        }

        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};


export const getTotalRevenue = async (): Promise<number> => {
    const { rows } = await query(
        `SELECT COALESCE(SUM(amount), 0) AS total_revenue
         FROM payments
         WHERE payment_status = 'paid'`
    );

    return Number(rows[0].total_revenue);
};
