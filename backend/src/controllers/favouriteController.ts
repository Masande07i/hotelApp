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

export const addFavourite = async (
    req: Request,
    res: Response
) => {
    const accommodation_id = Number(req.params.accommodation_id);

    if (!Number.isInteger(accommodation_id) || accommodation_id <= 0) {
        return res.status(400).json({
            message: "Invalid accommodation ID"
        });
    }

    try {
        const user_id = req.user!.id;

        const favourite = await favouriteService.addFavourite(
            user_id,
            accommodation_id
        );

        return res.status(201).json({
            message: "Accommodation added to favourites",
            favourite
        });
       } catch (error: any) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Accommodation is already in your favourites"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error adding accommodation to favourites"
        });
    }
}

export const removeFavourite = async (
    req: Request,
    res: Response
) => {
    const accommodation_id = Number(req.params.accommodation_id);

    if (!Number.isInteger(accommodation_id) || accommodation_id <= 0) {
        return res.status(400).json({
            message: "Invalid accommodation ID"
        });
    }

    try {
        const user_id = req.user!.id;

        const favourite = await favouriteService.removeFavourite(
            user_id,
            accommodation_id
        );

        if (!favourite) {
            return res.status(404).json({
                message: "Favourite not found"
            });
        }

        return res.status(200).json({
            message: "Accommodation removed from favourites",
            favourite
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error removing accommodation from favourites"
        });
    }
};