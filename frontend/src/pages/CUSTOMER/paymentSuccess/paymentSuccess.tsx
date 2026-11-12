import styles from "./paymentSuccess.module.css";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { Footer } from "../../../components/footer/footer";
import {
    FaHourglassHalf,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

export const PaymentSuccess = () => {
    const location = useLocation();
    const token = useSelector((state: RootState) => state.auth.token);

    const [status, setStatus] = useState<
        "loading" | "success" | "failed"
    >("loading");

    const [message, setMessage] = useState(
        "Verifying your payment..."
    );

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(location.search);
            const reference = params.get("reference");

            if (!reference) {
                setStatus("failed");
                setMessage("Payment reference was not found.");
                return;
            }

            try {
                const response = await fetch(
                    `/api/payments/verify?reference=${encodeURIComponent(reference)}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setStatus("failed");
                    setMessage(
                        data.message || "Payment verification failed."
                    );
                    return;
                }

                setStatus("success");
                setMessage(
                    "Your payment was successful. Your booking is confirmed."
                );

            } catch (error) {
                console.error("Payment verification error:", error);
                setStatus("failed");
                setMessage(
                    "Unable to verify your payment. Please try again."
                );
            }
        };

        verifyPayment();
    }, [location.search, token]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {status === "loading" && (
                        <>
                            <div className={styles.icon}>
                                <FaHourglassHalf />
                            </div>

                            <Text variant="h2">
                                Verifying Payment
                            </Text>

                            <Text
                                variant="p"
                                className={styles.message}
                            >
                                {message}
                            </Text>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className={styles.icon}>
                                <FaCheckCircle />
                            </div>

                            <Text variant="h1">
                                Payment Successful!
                            </Text>

                            <Text
                                variant="p"
                                className={styles.message}
                            >
                                {message}
                            </Text>

                            <Link to="/profile">
                                <Button
                                    label="Go to Profile"
                                    onClick={() => {}}
                                />
                            </Link>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div
                                className={`${styles.icon} ${styles.errorIcon}`}
                            >
                                <FaTimesCircle />
                            </div>

                            <Text variant="h2">
                                Payment Not Verified
                            </Text>

                            <Text
                                variant="p"
                                className={styles.message}
                            >
                                {message}
                            </Text>

                            <Link to="/accomodations">
                                <Button
                                    label="Back to Accommodations"
                                    onClick={() => {}}
                                />
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};