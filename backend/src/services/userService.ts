import { query } from "../config/database";
import bcrypt from "bcryptjs";
import { User } from "../types/user.types";

type PublicUser = Omit<User, "password_hash">;

export const findUserByEmail = async (
    email: string
): Promise<User | null> => {
    const { rows } = await query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return rows[0] || null;
};

export const createUser = async (
    email: string,
    password: string,
    name: string
): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { rows } = await query(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [email, password_hash, name]
    );

    return rows[0];
};

export const findUserById = async (
    id: number
): Promise<User | null> => {
    const { rows } = await query(
        `SELECT *
         FROM users
         WHERE id = $1`,
        [id]
    );

    return rows[0] || null;
};

export const getAllUsers = async (): Promise<PublicUser[]> => {
    const { rows } = await query(
        `SELECT id, name, email, profile_image, role, created_at, updated_at
         FROM users
         ORDER BY id ASC`
    );

    return rows;
};

export const updateUser = async (
    id: number,
    email: string,
    name: string,
    profile_image: string | null
): Promise<PublicUser | null> => {
    const { rows } = await query(
        `UPDATE users
         SET email = $1,
             name = $2,
             profile_image = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING id, name, email, profile_image, role, created_at, updated_at`,
        [email, name, profile_image, id]
    );

    return rows[0] || null;
};

export const deleteUserById = async (
    id: number
): Promise<PublicUser | null> => {
    const { rows } = await query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id, name, email, profile_image, role, created_at, updated_at`
    , [id]);

    return rows[0] || null;
};
