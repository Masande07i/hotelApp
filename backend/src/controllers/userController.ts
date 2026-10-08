import { Request, Response } from "express";
import * as userService from "../services/userService"

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const user = await userService.findUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving user" });
    }
};

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const { email, name, display_picture } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await userService.updateUserById(
            id,
            email,
            name,
            display_picture
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating user"
        });
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const user = await userService.deleteUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting user"
        });
    }
};