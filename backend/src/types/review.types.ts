export interface Review {
    id: number;
    user_id: number;
    accommodation_id: number;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}