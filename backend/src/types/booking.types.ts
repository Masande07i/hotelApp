export interface Booking {
    id: number;
    user_id: number;
    check_in: string;
    check_out: string;
    number_of_rooms: number;
    number_of_guests: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: Date;
    updated_at: Date;
}

export interface BookingRoom {
    id: number;
    booking_id: number;
    room_id: number;
    number_of_rooms: number;
    price_per_night: number;
}
