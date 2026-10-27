import crypto from "crypto";
import axios from "axios";
import { lookup } from "node:dns/promises";

const encodeValue = (value: string): string => {
    return encodeURIComponent(value.trim())
        .replace(/[!'()*]/g, (char) =>
            `%${char.charCodeAt(0).toString(16).toUpperCase()}`
        )
        .replace(/%20/g, "+");
};

export const generatePayFastSignature = (
    data: Record<string, string>,
    passphrase: string
): string => {
    const parameterString = Object.entries(data)
        .filter(([, value]) => value.trim() !== "")
        .map(([key, value]) => `${key}=${encodeValue(value)}`)
        .join("&");

    const signatureString = passphrase
        ? `${parameterString}&passphrase=${encodeValue(passphrase)}`
        : parameterString;

    return crypto
        .createHash("md5")
        .update(signatureString)
        .digest("hex");
};

export const verifyPayFastSignature = (
    data: Record<string, string>,
    receivedSignature: string,
    passphrase: string
): boolean => {
   const { signature, ...signatureData } = data;

    const expectedSignature = generatePayFastSignature(
        signatureData,
        passphrase
    );
        const expected = Buffer.from(expectedSignature);
    const received = Buffer.from(receivedSignature);

    if (expected.length !== received.length) {
        return false;
    }

    return crypto.timingSafeEqual(expected, received);
};

export const confirmPayFastNotification = async (
    data: Record<string, string>
): Promise<boolean> => {
    try {
        const response = await axios.post(
            "https://sandbox.payfast.co.za/eng/query/validate",
            new URLSearchParams(data).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data.trim() === "VALID";

    } catch (error) {
        console.log("PayFast confirmation error:", error);
        return false;
    }
};

export const isValidPayFastIP = async (
    ipAddress: string | undefined
): Promise<boolean> => {
    if (!ipAddress) {
        return false;
    }

    const clientIP = ipAddress.replace(/^::ffff:/i, "");

    const hosts = [
        "www.payfast.co.za",
        "sandbox.payfast.co.za",
        "w1w.payfast.co.za",
        "w2w.payfast.co.za"
    ];

    try {
        for (const host of hosts) {
            const addresses = await lookup(host, { all: true });

            const isValid = addresses.some(
                (address) =>
                    address.address.replace(/^::ffff:/i, "") === clientIP
            );

            if (isValid) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.log("PayFast IP verification error:", error);
        return false;
    }
};