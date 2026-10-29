
import axios from "axios";
import {
    PaystackInitializeResponse,
    PaystackVerifyResponse
} from "../types/payment.types";

const paystack = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
    }
});

export const initializePaystackPayment = async (
    email: string,
    amount: number,
    reference: string,
    booking_id: number
): Promise<PaystackInitializeResponse> => {
    const response = await paystack.post("/transaction/initialize", {
        email,
        amount: Math.round(amount * 100),
        reference,
        currency: "ZAR",
        callback_url: `${process.env.FRONTEND_URL}/payment/success`,
        metadata: {
            booking_id
        }
    });

    return response.data;
};

export const verifyPaystackPayment = async (
    reference: string
): Promise<PaystackVerifyResponse> => {
    const response = await paystack.get(
        `/transaction/verify/${encodeURIComponent(reference)}`
    );

    return response.data;
};
