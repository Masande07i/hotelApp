
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

        if (
            Number.isNaN(Date.parse(check_in)) ||
            Number.isNaN(Date.parse(check_out)) ||
            check_in >= check_out
        ) {
            return res.status(400).json({
                message: "Valid check-in and check-out dates are required"
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

export const calculateBookingPrice = async (
    req: Request,
    res: Response
) => {
    try {
        const room_id = Number(req.params.room_id);
        const { check_in, check_out, number_of_rooms } = req.query;

        if (!Number.isInteger(room_id) || room_id <= 0) {
            return res.status(400).json({
                message: "Invalid room ID"
            });
        }

        if (
            typeof check_in !== "string" ||
            typeof check_out !== "string" ||
            !check_in ||
            !check_out ||
            Number.isNaN(Date.parse(check_in)) ||
            Number.isNaN(Date.parse(check_out)) ||
            check_in >= check_out
        ) {
            return res.status(400).json({
                message: "Valid check-in and check-out dates are required"
            });
        }

        const rooms = Number(number_of_rooms);

        if (!Number.isInteger(rooms) || rooms <= 0) {
            return res.status(400).json({
                message: "Number of rooms must be a positive integer"
            });
        }

        const total_price = await bookingService.calculateBookingPrice(
            room_id,
            check_in,
            check_out,
            rooms
        );

        return res.status(200).json({
            room_id,
            check_in,
            check_out,
            number_of_rooms: rooms,
            total_price
        });
    } catch (error) {
        console.log(error);

        if (error instanceof Error && error.message === "Room not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Error calculating booking price"
        });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const user_id = req.user.id;
        const {
            check_in,
            check_out,
            room_id,
            number_of_rooms,
            number_of_guests
        } = req.body;

        if (
            typeof check_in !== "string" ||
            typeof check_out !== "string" ||
            !check_in ||
            !check_out ||
            Number.isNaN(Date.parse(check_in)) ||
            Number.isNaN(Date.parse(check_out)) ||
            check_in >= check_out
        ) {
            return res.status(400).json({
                message: "Valid check-in and check-out dates are required"
            });
        }

        const roomId = Number(room_id);
        const rooms = Number(number_of_rooms);
        const guests = Number(number_of_guests);

        if (!Number.isInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                message: "Invalid room ID"
            });
        }

        if (!Number.isInteger(rooms) || rooms <= 0) {
            return res.status(400).json({
                message: "Number of rooms must be a positive integer"
            });
        }

        if (!Number.isInteger(guests) || guests <= 0) {
            return res.status(400).json({
                message: "Number of guests must be a positive integer"
            });
        }

        const booking = await bookingService.createBooking(
            user_id,
            check_in,
            check_out,
            roomId,
            rooms,
            guests
        );

        return res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            if (error.message === "Room not found") {
                return res.status(404).json({
                    message: error.message
                });
            }

            if (
                error.message === "Invalid booking dates" ||
                error.message === "Invalid number of rooms" ||
                error.message === "Invalid number of guests" ||
                error.message === "Not enough rooms available"
            ) {
                return res.status(400).json({
                    message: error.message
                });
            }
        }

        return res.status(500).json({
            message: "Error creating booking"
        });
    }
};
