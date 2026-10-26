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