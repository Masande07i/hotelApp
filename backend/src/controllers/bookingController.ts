import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";

export const getRoomForBooking = async (req: Request, res: Response) => {
    try {
        const room_id = Number(req.params.room_id);

        if (!Number.isInteger(room_id) || room_id <= 0) {
            return res.status(400).json({
                message: "Invalid room ID"
            });
        }

        const room = await bookingService.getRoomForBooking(room_id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving room"
        });
    }
};

export const getAvailableRooms = async (req: Request, res: Response) => {
    try {
        const room_id = Number(req.params.room_id);
        const { check_in, check_out } = req.query;

        if (!Number.isInteger(room_id) || room_id <= 0) {
            return res.status(400).json({
                message: "Invalid room ID"
            });
        }

        if (
            typeof check_in !== "string" ||
            typeof check_out !== "string" ||
            !check_in ||
            !check_out
        ) {
            return res.status(400).json({
                message: "Check-in and check-out dates are required"
            });
        }

        if (check_in >= check_out) {
            return res.status(400).json({
                message: "Check-out must be after check-in"
            });
        }

        const available_rooms = await bookingService.getAvailableRooms(
            room_id,
            check_in,
            check_out
        );

        return res.status(200).json({
            room_id,
            check_in,
            check_out,
            available_rooms
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error checking room availability"
        });
    }
};