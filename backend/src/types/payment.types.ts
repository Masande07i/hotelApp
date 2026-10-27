export interface Payment {
    id: number;
    booking_id: number;
    amount: string;
    payment_status: "pending" | "paid" | "failed" | "refunded";
    payment_reference: string | null;
    payment_method: string;
    created_at: string;
    updated_at: string;
}
