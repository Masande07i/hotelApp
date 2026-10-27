import crypto from "crypto";

export const generatePayFastSignature = (
    data: Record<string, string>,
    passphrase: string
): string => {
    const parameterString = Object.entries(data)
        .filter(([, value]) => value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, "+")}`)
        .join("&");

    const signatureString = `${parameterString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;

    return crypto
        .createHash("md5")
        .update(signatureString)
        .digest("hex");
};
