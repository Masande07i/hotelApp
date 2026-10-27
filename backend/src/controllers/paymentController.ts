
import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";
import {
    generatePayFastSignature,
    isValidPayFastIP,
    verifyPayFastSignature,
    confirmPayFastNotification
} from "../utils/payfast";
import crypto from "crypto";

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

        const payment_reference = `HAVENLY-${crypto.randomUUID()}`;

        const payment = await paymentService.createPayment(
            booking.id,
            Number(booking.total_price),
            payment_reference
        );

        const nameParts = booking.name.trim().split(/\s+/);

        const paymentData: Record<string, string> = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID!,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            notify_url: `${process.env.BACKEND_URL}/api/payments/notify`,
            name_first: nameParts[0],
            name_last: nameParts.slice(1).join(" "),
            email_address: booking.email,
            m_payment_id: payment_reference,
            amount: Number(booking.total_price).toFixed(2),
            item_name: `Havenly Booking ${booking.id}`
        };

        const signature = generatePayFastSignature(
            paymentData,
            process.env.PAYFAST_PASSPHRASE || ""
        );

        paymentData.signature = signature;

        return res.status(200).json({
            message: "Payment initialized successfully",
            payment,
            paymentUrl: process.env.PAYFAST_PROCESS_URL,
            paymentData
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error initializing payment"
        });
    }
};

export const paymentNotification = async (
    req: Request,
    res: Response
) => {
    try {
        const notificationData = req.body as Record<string, string>;

        const isValidIP = await isValidPayFastIP(req.ip);

        if (!isValidIP) {
            return res.status(403).send("Unauthorized notification source");
        }

        const receivedSignature = notificationData.signature;

        if (!receivedSignature) {
            return res.status(400).send("Missing payment signature");
        }

        const isValidSignature = verifyPayFastSignature(
            notificationData,
            receivedSignature,
            process.env.PAYFAST_PASSPHRASE || ""
        );

        if (!isValidSignature) {
            return res.status(400).send("Invalid payment signature");
        }

        if (notificationData.merchant_id !== process.env.PAYFAST_MERCHANT_ID) {
            return res.status(400).send("Invalid merchant ID");
        }

        if (notificationData.payment_status !== "COMPLETE") {
            return res.status(400).send("Payment is not complete");
        }

        const payment_reference = notificationData.m_payment_id;

        if (!payment_reference) {
            return res.status(400).send("Missing payment reference");
        }

        const payment = await paymentService.getPaymentByReference(
            payment_reference
        );

        if (!payment) {
            return res.status(404).send("Payment not found");
        }

        if (payment.payment_status === "paid") {
            return res.status(200).send("Payment already processed");
        }

        if (payment.payment_status !== "pending") {
            return res.status(400).send("Payment cannot be processed");
        }

        const amount = Number(notificationData.amount_gross);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).send("Invalid payment amount");
        }

        const isValidAmount = await paymentService.verifyPaymentAmount(
            payment_reference,
            amount
        );

        if (!isValidAmount) {
            return res.status(400).send("Payment amount mismatch");
        }

        const isConfirmed = await confirmPayFastNotification(
            notificationData
        );

        if (!isConfirmed) {
            return res.status(400).send("PayFast notification could not be confirmed");
        }

        await paymentService.completePayment(
            payment_reference,
            payment.booking_id
        );

        return res.status(200).send("Payment successfully processed");

    } catch (error) {
        console.log(error);

        return res.status(500).send("Notification error");
    }
};
