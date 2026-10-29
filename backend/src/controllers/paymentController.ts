import { Request, Response } from "express";
import crypto from "crypto";
import * as paymentService from "../services/paymentService";
import {
    initializePaystackPayment,
    verifyPaystackPayment
} from "../utils/paystack"

export const initializePayment = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const booking_id = Number(req.body.booking_id);

        if (!Number.isInteger(booking_id) || booking_id <= 0) {
            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }

        const booking = await paymentService.getBookingForPayment(
            booking_id,
            req.user.id
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or unavailable for payment"
            });
        }

        const amount = Number(booking.total_price);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Invalid booking amount"
            });
        }

        const payment_reference = `HAVENLY-${crypto.randomUUID()}`;

        const payment = await paymentService.createPayment(
            booking.id,
            amount,
            payment_reference
        );

        const paystackResponse = await initializePaystackPayment(
            booking.email,
            amount,
            payment_reference,
            booking.id
        );

        if (!paystackResponse.status) {
            await paymentService.updatePaymentStatus(
                payment_reference,
                "failed"
            );

            return res.status(400).json({
                message: "Unable to initialize Paystack payment"
            });
        }

        return res.status(200).json({
            message: "Payment initialized successfully",
            payment,
            authorization_url: paystackResponse.data.authorization_url,
            reference: paystackResponse.data.reference
        });

    } catch (error) {
        console.error("Payment initialization error:", error);

        return res.status(500).json({
            message: "Error initializing payment"
        });
    }
};

export const verifyPayment = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const reference = String(req.query.reference || "");

        if (!reference) {
            return res.status(400).json({
                message: "Payment reference is required"
            });
        }

        const payment = await paymentService.getPaymentByReference(
            reference
        );

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.payment_status === "paid") {
            return res.status(200).json({
                message: "Payment already verified",
                payment
            });
        }

        if (payment.payment_status !== "pending") {
            return res.status(400).json({
                message: "Payment cannot be verified"
            });
        }

        const verifiedPayment = await verifyPaystackPayment(reference);

        if (
            !verifiedPayment.status ||
            verifiedPayment.data.status !== "success" ||
            verifiedPayment.data.reference !== reference ||
            verifiedPayment.data.currency !== "ZAR"
        ) {
            return res.status(400).json({
                message: "Payment was not successful"
            });
        }

        const isValidAmount = await paymentService.verifyPaymentAmount(
            reference,
            verifiedPayment.data.amount
        );

        if (!isValidAmount) {
            return res.status(400).json({
                message: "Payment amount does not match booking"
            });
        }

        await paymentService.completePayment(
            reference,
            payment.booking_id
        );

        const updatedPayment = await paymentService.getPaymentByReference(
            reference
        );

        return res.status(200).json({
            message: "Payment successfully verified",
            payment: updatedPayment
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            message: "Error verifying payment"
        });
    }
};
