import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving users"
        });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
            ? Number(req.params.id)
            : req.user?.id;

        if (!id || !Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await userService.findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { password_hash, ...safeUser } = user;

        return res.status(200).json(safeUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving user"
        });
    }
};



export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
            ? Number(req.params.id)
            : req.user?.id;

        const { name, email, profile_image } = req.body;

        if (!id || !Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        if (
            profile_image !== undefined &&
            profile_image !== null &&
            typeof profile_image !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid profile image"
            });
        }

        const existingUser = await userService.findUserById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = await userService.updateUser(
            id,
            email.trim(),
            name.trim(),
            profile_image === undefined
                ? existingUser.profile_image
                : profile_image
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.log(error);

        const dbError = error as { code?: string };

        if (dbError.code === "23505") {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        return res.status(500).json({
            message: "Error updating user"
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

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

        const dbError = error as { code?: string };

        if (dbError.code === "23503") {
            return res.status(409).json({
                message: "This user cannot be deleted because related records exist"
            });
        }

        return res.status(500).json({
            message: "Error deleting user"
        });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "Name, email, password and role are required"
        });
    }

    if (role !== "customer" && role !== "admin") {
        return res.status(400).json({
            message: "Invalid user role"
        });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already in use"
            });
        }

        const newUser = await userService.createUser(
            email,
            password,
            name,
            role
        );

        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating user"
        });
    }
};