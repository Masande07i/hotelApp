export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    profile_image: string | null;
    role: "customer" | "admin";
    created_at: Date;
    updated_at: Date;
}