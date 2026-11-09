export interface Notification {
    id: number;
    user_id: number;
    booking_id: number | null;
    title: string;
    message: string;
    type: 'booking_created' | 'booking_confirmed' | 'booking_cancelled' | 'booking_updated' | 'payment_success' | 'promotion';
    is_read: boolean;
    created_at: Date;
}


