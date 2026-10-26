import { query } from "../config/database";
import { Favourite } from "../types/favourite.types"

export const getFavourites = async (
    user_id: number
): Promise<Favourite[]> => {
    const { rows } = await query(
        `SELECT * FROM favourites
         WHERE user_id = $1
         ORDER BY created_at DESC`,
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