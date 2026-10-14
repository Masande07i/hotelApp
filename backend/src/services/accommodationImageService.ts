import cloudinary from "../config/cloudinary";
import { query } from "../config/database";

export const uploadAccommodationImage = async (
    accommodationId: number,
    fileBuffer: Buffer
) => {
    const accommodation = await query(
        "SELECT id FROM accommodations WHERE id = $1",
        [accommodationId]
    );

    if (accommodation.rows.length === 0) {
        throw new Error("Accommodation not found");
    }

    const uploadedImage = await new Promise<{
        secure_url: string;
        public_id: string;
    }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "havenly/accommodations" },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Image upload failed"));
                    return;
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        uploadStream.end(fileBuffer);
    });

    const result = await query(
        `INSERT INTO accommodation_images
        (accommodation_id, image_url, public_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            accommodationId,
            uploadedImage.secure_url,
            uploadedImage.public_id
        ]
    );

    return result.rows[0];
};


export const getAccommodationImages = async (accommodationId: number) => {
    const result = await query(
        `SELECT *
         FROM accommodation_images
         WHERE accommodation_id = $1
         ORDER BY created_at DESC`,
        [accommodationId]
    );

    return result.rows;
};


export const deleteAccommodationImage = async (imageId: number) => {
    const result = await query(
        "SELECT * FROM accommodation_images WHERE id = $1",
        [imageId]
    );

    if (result.rows.length === 0) {
        throw new Error("Accommodation image not found");
    }

    const image = result.rows[0];

    const cloudinaryResult = await cloudinary.uploader.destroy(
        image.public_id
    );

    if (cloudinaryResult.result !== "ok" &&
        cloudinaryResult.result !== "not found") {
        throw new Error("Failed to delete image from Cloudinary");
    }

    await query(
        "DELETE FROM accommodation_images WHERE id = $1",
        [imageId]
    );

    return image;
};

