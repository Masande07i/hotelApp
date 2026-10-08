export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    display_picture?: string;
    role: "guest" | "admin";
}