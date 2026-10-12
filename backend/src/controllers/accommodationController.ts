import { Request, Response } from "express";
import * as accommodationService from "../services/accomodation"

export const createAccommodation = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        description,
        address,
        city,
        country,
        star_rating
    } = req.body;

    if (!name || !description || !address || !city || !country) {
        return res.status(400).json({
            message: "Name, description, address, city and country are required"
        });
    }

    try {
        const accommodation = await accommodationService.createAccommodation(
            name,
            description,
            address,
            city,
            country,
            star_rating ?? null
        );

        return res.status(201).json({
            message: "Accommodation created successfully",
            accommodation
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error creating accommodation"
        });
    }
};

export const getAllAccommodations = async (
    req: Request,
    res: Response
) => {
    try {
        const accommodations =
            await accommodationService.getAllAccommodations();

        return res.status(200).json(accommodations);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching accommodations"
        });
    }
};

export const getAccommodationById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid accommodation ID"
        });
    }

    try {
        const accommodation =
            await accommodationService.getAccommodationById(id);

        if (!accommodation) {
            return res.status(404).json({
                message: "Accommodation not found"
            });
        }

        return res.status(200).json(accommodation);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching accommodation"
        });
    }
};
