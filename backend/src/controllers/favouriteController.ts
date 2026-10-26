import { Request, Response } from "express";
import * as favouriteService from "../services/favouriteService";

export const getFavourites = async (
    req: Request,
    res: Response
) => {
    try {
        const user_id = req.user!.id;

        const favourites = await favouriteService.getFavourites(user_id);

        return res.status(200).json(favourites);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching favourites"
        });
    }
};