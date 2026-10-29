import { query } from "../config/database";
import { Accommodation } from "../types/accomodation.types"

export const createAccommodation = async (
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    star_rating: number | null,
    latitude: number | null,
    longitude: number | null
): Promise<Accommodation> => {
    const { rows } = await query(
        `INSERT INTO accommodations
         (name, description, address, city, country, star_rating, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, description, address, city, country, star_rating, latitude, longitude]
    );

    return rows[0];
};

export const getAllAccommodations = async (): Promise<Accommodation[]> => {
    const { rows } = await query(
        `SELECT * FROM accommodations
         ORDER BY created_at DESC`
    );

    return rows;
};

export const getAccommodationById = async (
    id: number
): Promise<Accommodation | null> => {
    const { rows } = await query(
        `SELECT * FROM accommodations
         WHERE id = $1`,
        [id]
    );

    return rows[0] || null;
};

export const updateAccommodation = async (
    id: number,
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    star_rating: number | null,
    latitude: number | null,
    longitude: number | null
): Promise<Accommodation | null> => {
    const { rows } = await query(
        `UPDATE accommodations
         SET name = $1,
             description = $2,
             address = $3,
             city = $4,
             country = $5,
             star_rating = $6,
             latitude = $7,
             longitude = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [name, description, address, city, country, star_rating, latitude, longitude, id]
    );

    return rows[0] || null;
};

export const deleteAccommodationById = async (
    id: number
): Promise<Accommodation | null> => {
    const { rows } = await query(
        `DELETE FROM accommodations
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return rows[0] || null;
};