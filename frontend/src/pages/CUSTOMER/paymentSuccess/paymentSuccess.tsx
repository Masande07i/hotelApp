
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";

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
                setMessage("Your payment was successful. Your booking is confirmed.");

            } catch (error) {
                console.error("Payment verification error:", error);
                setStatus("failed");
                setMessage("Unable to verify your payment. Please try again.");
            }
        };

        verifyPayment();
    }, [location.search, token]);

    return (
        <div>
            <Text variant="h1">Payment Status</Text>

            {status === "loading" && (
                <Text variant="p">{message}</Text>
            )}

            {status === "success" && (
                <>
                    <Text variant="h2">Payment Successful!</Text>
                    <Text variant="p">{message}</Text>
                    <Link to="/profile">
                        <Button label="Go to Profile" onClick={() => {}} />
                    </Link>
                </>
            )}

            {status === "failed" && (
                <>
                    <Text variant="h2">Payment Not Verified</Text>
                    <Text variant="p">{message}</Text>
                    <Link to="/accomodations">
                        <Button label="Back to Accommodations" onClick={() => {}} />
                    </Link>
                </>
            )}
        </div>
    );
};
