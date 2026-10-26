import { query } from "../config/database";
import { Favourite } from "../types/favourite.types"
import { Accommodation } from "../types/accomodation.types";

export const getFavourites = async (
    user_id: number
): Promise<Accommodation[]> => {
    const { rows } = await query(
        `SELECT accommodations.*
         FROM favourites
         JOIN accommodations
         ON favourites.accommodation_id = accommodations.id
         WHERE favourites.user_id = $1
         ORDER BY favourites.created_at DESC`,
        [user_id]
    );

    return rows;
};

export const addFavourite = async (
    user_id: number,
    accommodation_id: number
): Promise<Favourite> => {
    const { rows } = await query(
        `INSERT INTO favourites
         (user_id, accommodation_id)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, accommodation_id]
    );

    return rows[0];
};

export const removeFavourite = async (
    user_id: number,
    accommodation_id: number
): Promise<Favourite | null> => {
    const { rows } = await query(
        `DELETE FROM favourites
         WHERE user_id = $1 AND accommodation_id = $2
         RETURNING *`,
        [user_id, accommodation_id]
    );

    return rows[0] || null;
};
