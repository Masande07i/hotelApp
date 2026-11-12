import styles from "./paymentSuccess.module.css";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { verifyPayment, resetPayment } from "../../../features/paymentSlice";
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
    const dispatch = useDispatch<AppDispatch>();

    const token = useSelector((state: RootState) => state.auth.token);
    const { status, message } = useSelector(
        (state: RootState) => state.payment
    );

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reference = params.get("reference");

        dispatch(resetPayment());

        if (!reference) {
            dispatch(
                verifyPayment({
                    reference: "",
                    token: token || ""
                })
            );
            return;
        }

        if (!token) {
            return;
        }

        dispatch(verifyPayment({ reference, token }));

        return () => {
            dispatch(resetPayment());
        };
    }, [location.search, token, dispatch]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {(status === "loading" || status === "idle") && (
                        <>
                            <div className={styles.icon}>
                                <FaHourglassHalf />
                            </div>
                            <Text variant="h2">Verifying Payment</Text>
                            <Text variant="p" className={styles.message}>
                                {message || "Please wait while we verify your payment..."}
                            </Text>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className={styles.icon}>
                                <FaCheckCircle />
                            </div>
                            <Text variant="h1">Payment Successful!</Text>
                            <Text variant="p" className={styles.message}>
                                {message}
                            </Text>
                            <Link to="/profile">
                                <Button label="Go to Profile" onClick={() => {}} />
                            </Link>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div className={`${styles.icon} ${styles.errorIcon}`}>
                                <FaTimesCircle />
                            </div>
                            <Text variant="h2">Payment Not Verified</Text>
                            <Text variant="p" className={styles.message}>
                                {message}
                            </Text>
                            <Link to="/accomodations">
                                <Button label="Back to Accommodations" onClick={() => {}} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};
