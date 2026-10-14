import { Request, Response } from "express";
import { uploadAccommodationImage,getAccommodationImages } from "../services/accommodationImageService";

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const accommodationId = Number(req.params.id);

        if (!Number.isInteger(accommodationId) || accommodationId <= 0) {
            res.status(400).json({ message: "Invalid accommodation ID" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "Please select an image" });
            return;
        }

        const image = await uploadAccommodationImage(
            accommodationId,
            req.file.buffer
        );

        res.status(201).json({
            message: "Image uploaded successfully",
            image
        });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(500).json({
            message: error instanceof Error
                ? error.message
                : "Failed to upload image"
        });
    }
};


export const getImages = async (req: Request, res: Response) => {
    try {
        const accommodationId = Number(req.params.id);

        if (!Number.isInteger(accommodationId) || accommodationId <= 0) {
            res.status(400).json({ message: "Invalid accommodation ID" });
            return;
        }

        const images = await getAccommodationImages(accommodationId);

        res.status(200).json({ images });
    } catch (error) {
        console.error("Get accommodation images error:", error);
        res.status(500).json({
            message: "Failed to retrieve accommodation images"
        });
    }
};
