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

