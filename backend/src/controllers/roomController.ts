import { Request, Response } from "express";
import * as roomService from "../services/roomService";

export const createRoom = async (
    req: Request,
    res: Response
) => {
    const {
        accommodation_id,
        room_type,
        description,
        bed_type,
        capacity,
        price_per_night,
        total_rooms,
        amenities
    } = req.body;

    if (!accommodation_id ||!room_type ||!capacity ||price_per_night === undefined ||!total_rooms ||!Array.isArray(amenities)
    ) {
        return res.status(400).json({
            message: "Accommodation, room type, capacity, price, total rooms and amenities are required"
        });
    }

    try {
        const room = await roomService.createRoom(
            accommodation_id,
            room_type,
            description ?? null,
            bed_type ?? null,
            capacity,
            price_per_night,
            total_rooms,
            amenities
        );

        return res.status(201).json({
            message: "Room created successfully",
            room
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error creating room"
        });
    }
};
