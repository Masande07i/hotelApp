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
    const fieldOrder = [
        "merchant_id",
        "merchant_key",
        "return_url",
        "cancel_url",
        "notify_url",
        "notify_method",
        "name_first",
        "name_last",
        "email_address",
        "cell_number",
        "m_payment_id",
        "amount",
        "item_name",
        "item_description",
        "custom_int1",
        "custom_int2",
        "custom_int3",
        "custom_int4",
        "custom_int5",
        "custom_str1",
        "custom_str2",
        "custom_str3",
        "custom_str4",
        "custom_str5",
        "email_confirmation",
        "confirmation_address",
        "currency",
        "payment_method"
    ];

    const parameterString = fieldOrder
        .filter((key) => data[key] !== undefined && data[key].trim() !== "")
        .map((key) => `${key}=${encodeValue(data[key])}`)
        .join("&");

    const signatureString = passphrase.trim()
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