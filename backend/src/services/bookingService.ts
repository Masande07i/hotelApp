import { query } from "../config/database";
import { Room } from "../types/room.types";

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
    const { rows } = await query(
        `SELECT price_per_night
         FROM rooms
         WHERE id = $1`,
        [room_id]
    );

    if (rows.length === 0) {
        throw new Error("Room not found");
    }

    const price_per_night = Number(rows[0].price_per_night);

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const number_of_nights = Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) /
        millisecondsPerDay
    );

    return price_per_night * number_of_rooms * number_of_nights;
};