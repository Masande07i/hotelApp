import crypto from "crypto";

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
