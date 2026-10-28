import { Request, Response } from "express";
import * as userService from "../services/userService"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";


const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const register = async (req: Request, res: Response) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name ) {
        return res.status(400).json({
            message: "Email, password, name and role are required"
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
            name
        );

        res.status(201).json({
            message: "User registered successfully",
            userId: newUser.id,
            role: newUser.role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error registering the user"
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const user = await userService.findUserByEmail(email);

       if (!user || !user.password_hash) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const payload = {
            userId: user.id,
            email: user.email
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );

       res.status(200).json({
    message: "Login Successful",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
    }
});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error logging in"
        });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({
            message: "Google ID token is required"
        });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.sub || !payload.email) {
            return res.status(401).json({
                message: "Invalid Google account"
            });
        }

        const google_id = payload.sub;
        const email = payload.email;
        const name = payload.name || email.split("@")[0];
        const profile_image = payload.picture || null;

        let user = await userService.findUserByGoogleId(google_id);

        if (!user) {
            user = await userService.findUserByEmail(email);

            if (user) {
                if (user.google_id && user.google_id !== google_id) {
                    return res.status(409).json({
                        message: "This email is already linked to another Google account"
                    });
                }

                return res.status(409).json({
                message: "An account with this email already exists. Please log in using your email and password first."
            });
            } else {
                user = await userService.createGoogleUser(
                    email,
                    name,
                    google_id,
                    profile_image
                );
            }
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile_image: user.profile_image,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Google authentication failed"
        });
    }
};

