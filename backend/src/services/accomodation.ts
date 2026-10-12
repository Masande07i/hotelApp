import { query } from "../config/database";
import { Accommodation } from "../types/accomodation.types"

export const createAccommodation = async (
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    star_rating: number | null
): Promise<Accommodation> => {
    const { rows } = await query(
        `INSERT INTO accommodations
         (name, description, address, city, country, star_rating)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, address, city, country, star_rating]
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

