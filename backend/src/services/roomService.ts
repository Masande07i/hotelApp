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


export const getAllRooms = async (): Promise<Room[]> => {
    const { rows } = await query(
        `SELECT * FROM rooms
         ORDER BY created_at DESC`
    );

    return rows;
};

export const getRoomById = async (
    id: number
): Promise<Room | null> => {
    const { rows } = await query(
        `SELECT * FROM rooms
         WHERE id = $1`,
        [id]
    );

    return rows[0] ?? null;
};
export const updateRoom = async (
    id: number,
    accommodation_id: number,
    room_type: string,
    description: string | null,
    bed_type: string | null,
    capacity: number,
    price_per_night: number,
    total_rooms: number,
    amenities: string[]
): Promise<Room | null> => {
    const { rows } = await query(
        `UPDATE rooms
         SET accommodation_id = $1,
             room_type = $2,
             description = $3,
             bed_type = $4,
             capacity = $5,
             price_per_night = $6,
             total_rooms = $7,
             amenities = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
            accommodation_id,
            room_type,
            description,
            bed_type,
            capacity,
            price_per_night,
            total_rooms,
            amenities,
            id
        ]
    );

    return rows[0] ?? null;
};

export const deleteRoom = async (
    id: number
): Promise<Room | null> => {
    const { rows } = await query(
        `DELETE FROM rooms
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return rows[0] ?? null;
};

export const getRoomsByAccommodationId = async (
    accommodation_id: number
): Promise<Room[]> => {
    const { rows } = await query(
        `SELECT * FROM rooms
         WHERE accommodation_id = $1
         ORDER BY created_at DESC`,
        [accommodation_id]
    );

    return rows;
};
