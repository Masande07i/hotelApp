import { query,getClient } from "../config/database";
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


export const getPaymentByReference = async (
    payment_reference: string
): Promise<Payment | null> => {
    const { rows } = await query(
        `SELECT * FROM payments
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


export const confirmBookingAfterPayment = async (
    booking_id: number
): Promise<void> => {
    await query(
        `UPDATE bookings
         SET status = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        ["confirmed", booking_id]
    );
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

    return Math.abs(Number(rows[0].amount) - amount) <= 0.01;
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
            SET payment_status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE payment_reference = $2
            AND booking_id = $3
            AND payment_status = 'pending'`,
            ["paid", payment_reference, booking_id]
        );

        if (paymentResult.rowCount !== 1) {
            throw new Error("Payment could not be updated");
        }

        await client.query(
            `UPDATE bookings
             SET status = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             AND status = 'pending'`,
            ["confirmed", booking_id]
        );

        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};
