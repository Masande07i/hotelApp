import { query } from "../config/database";
import bcrypt from "bcryptjs"
import { User } from "../types/user.types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const { rows } = await query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return rows[0] || null;
};

export const createUser = async (
    email: string,
    password: string,
    name: string,
   
): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { rows } = await query(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1, $2, $3)
         RETURNING id, email, name`,
        [email, password_hash, name]
    );

    return rows[0];
};

export const findUserById = async (
    id: number
): Promise<User | null> => {
    const { rows } = await query(
        `SELECT id, email, name, display_picture, role
         FROM users
         WHERE id = $1`,
        [id]
    );

    return rows[0] || null;
};

