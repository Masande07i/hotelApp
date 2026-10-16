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

    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23503"
    ) {
        return res.status(400).json({
            message: "The accommodation does not exist"
        });
    }

    return res.status(500).json({
        message: "Error creating room"
    });
}
}


export const getAllRooms = async (
    req: Request,
    res: Response
) => {
    try {
        const rooms = await roomService.getAllRooms();

        return res.status(200).json(rooms);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching rooms"
        });
    }
};

export const getRoomById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

    try {
        const room = await roomService.getRoomById(id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching room"
        });
    }
};

export const updateRoom = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

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

    if (!accommodation_id ||!room_type ||capacity === undefined ||price_per_night === undefined ||total_rooms === undefined ||
        !Array.isArray(amenities)
    ) {
        return res.status(400).json({
            message: "Accommodation, room type, capacity, price, total rooms and amenities are required"
        });
    }

    try {
        const room = await roomService.updateRoom(
            id,
            accommodation_id,
            room_type,
            description ?? null,
            bed_type ?? null,
            capacity,
            price_per_night,
            total_rooms,
            amenities
        );

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        return res.status(200).json({
            message: "Room updated successfully",
            room
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error updating room"
        });
    }
};

export const deleteRoom = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid room ID"
        });
    }

    try {
        const room = await roomService.deleteRoom(id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        return res.status(200).json({
            message: "Room deleted successfully",
            room
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error deleting room"
        });
    }
};


export const getRoomsByAccommodationId = async (
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
        const rooms = await roomService.getRoomsByAccommodationId(
            accommodation_id
        );

        return res.status(200).json(rooms);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error fetching rooms for accommodation"
        });
    }
};
