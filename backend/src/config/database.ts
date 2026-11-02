import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const textDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connection successful");
        client.release();
    } catch (error) {
        console.log("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export const getClient = () => pool.connect();