import { query } from "../config/database";
import { Room } from "../types/room.types";

export const createRoom = async (
    accommodation_id: number,
    room_type: string,
    description: string | null,
    bed_type: string | null,
    capacity: number,
    price_per_night: number,
    total_rooms: number,
    amenities: string[]
): Promise<Room> => {
    const { rows } = await query(
        `INSERT INTO rooms
         (accommodation_id, room_type, description, bed_type, capacity,
          price_per_night, total_rooms, amenities)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
            accommodation_id,
            room_type,
            description,
            bed_type,
            capacity,
            price_per_night,
            total_rooms,
            amenities
        ]
    );

    return rows[0];
};
