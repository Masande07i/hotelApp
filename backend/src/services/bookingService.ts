import { query, getClient } from "../config/database";
import { Room } from "../types/room.types";

const calculateTotalPrice = (
    price_per_night: number,
    check_in: string,
    check_out: string,
    number_of_rooms: number
): number => {
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const number_of_nights = Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) /
        millisecondsPerDay
    );

    return price_per_night * number_of_rooms * number_of_nights;
};

export const getRoomForBooking = async (
    room_id: number
): Promise<Room | null> => {
    const { rows } = await query(
        `SELECT * FROM rooms
         WHERE id = $1`,
        [room_id]
    );

    return rows[0] ?? null;
};

export const getAvailableRooms = async (
    room_id: number,
    check_in: string,
    check_out: string
): Promise<number> => {
    const { rows } = await query(
        `SELECT
            r.total_rooms - COALESCE((
                SELECT SUM(br.number_of_rooms)
                FROM booking_rooms br
                JOIN bookings b ON b.id = br.booking_id
                WHERE br.room_id = r.id
                AND b.status != 'cancelled'
                AND b.check_in < $3
                AND b.check_out > $2
            ), 0) AS available_rooms
         FROM rooms r
         WHERE r.id = $1`,
        [room_id, check_in, check_out]
    );

    return Number(rows[0]?.available_rooms ?? 0);
};

export const calculateBookingPrice = async (
    room_id: number,
    check_in: string,
    check_out: string,
    number_of_rooms: number
): Promise<number> => {
    const room = await getRoomForBooking(room_id);

    if (!room) {
        throw new Error("Room not found");
    }

    return calculateTotalPrice(
        Number(room.price_per_night),
        check_in,
        check_out,
        number_of_rooms
    );
};

export const createBooking = async (
    user_id: number,
    check_in: string,
    check_out: string,
    room_id: number,
    number_of_rooms: number,
    number_of_guests: number
) => {
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime()) ||
        checkOutDate <= checkInDate
    ) {
        throw new Error("Invalid booking dates");
    }

    const client = await getClient();

    try {
        await client.query("BEGIN");

        const roomResult = await client.query(
            `SELECT * FROM rooms
             WHERE id = $1
             FOR UPDATE`,
            [room_id]
        );

        const room = roomResult.rows[0];

        if (!room) {
            throw new Error("Room not found");
        }

        if (
            !Number.isInteger(number_of_rooms) ||
            number_of_rooms < 1
        ) {
            throw new Error("Invalid number of rooms");
        }

        if (
            !Number.isInteger(number_of_guests) ||
            number_of_guests < 1 ||
            number_of_guests > room.capacity * number_of_rooms
        ) {
            throw new Error("Invalid number of guests");
        }

        const availabilityResult = await client.query(
            `SELECT
                r.total_rooms - COALESCE((
                    SELECT SUM(br.number_of_rooms)
                    FROM booking_rooms br
                    JOIN bookings b ON b.id = br.booking_id
                    WHERE br.room_id = r.id
                    AND b.status != 'cancelled'
                    AND b.check_in < $3
                    AND b.check_out > $2
                ), 0) AS available_rooms
             FROM rooms r
             WHERE r.id = $1`,
            [room_id, check_in, check_out]
        );

        const available_rooms = Number(
            availabilityResult.rows[0]?.available_rooms ?? 0
        );

        if (available_rooms < number_of_rooms) {
            throw new Error("Not enough rooms available");
        }

        const price_per_night = Number(room.price_per_night);

        const total_price = calculateTotalPrice(
            price_per_night,
            check_in,
            check_out,
            number_of_rooms
        );

        const bookingResult = await client.query(
            `INSERT INTO bookings (
                user_id,
                check_in,
                check_out,
                number_of_rooms,
                number_of_guests,
                total_price,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                user_id,
                check_in,
                check_out,
                number_of_rooms,
                number_of_guests,
                total_price,
                "pending"
            ]
        );

        const booking = bookingResult.rows[0];

        await client.query(
            `INSERT INTO booking_rooms (
                booking_id,
                room_id,
                number_of_rooms,
                price_per_night
            )
            VALUES ($1, $2, $3, $4)`,
            [
                booking.id,
                room_id,
                number_of_rooms,
                price_per_night
            ]
        );

        await client.query("COMMIT");

        return booking;
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Booking rollback failed:", rollbackError);
        }

        throw error;
    } finally {
        client.release();
    }
};


export const getMyBookings = async (user_id: number) => {
    const { rows } = await query(
        `SELECT *
         FROM bookings
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [user_id]
    );

    return rows;
};

export const cancelBooking = async (
    booking_id: number,
    user_id: number
) => {
    const { rows } = await query(
        `UPDATE bookings
         SET status = 'cancelled',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         AND user_id = $2
         AND status != 'cancelled'
         RETURNING *`,
        [booking_id, user_id]
    );

    return rows[0] ?? null;
};

export const getAllBookings = async () => {
    const { rows } = await query(
        `SELECT
            b.*,
            u.name AS customer_name,
            u.email AS customer_email
         FROM bookings b
         JOIN users u ON u.id = b.user_id
         ORDER BY b.created_at DESC`
    );

    return rows;
};

