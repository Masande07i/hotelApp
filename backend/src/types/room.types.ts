export interface Room {
    id: number;
    accommodation_id: number;
    room_type: string;
    description: string | null;
    bed_type: string | null;
    capacity: number;
    price_per_night: string;
    total_rooms: number;
    amenities: string[];
    created_at: Date;
    updated_at: Date;
}
