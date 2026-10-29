
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

export interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        status: string;
        reference: string;
        amount: number;
        currency: string;
    };
}
