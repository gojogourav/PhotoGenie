import cloudinary from "../utils/cloudinary";
import fs from 'fs'
import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return
        }

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'user_uploads',
                },
                (error, result) => {
                    if (error || !result) reject(error);
                    else resolve(result);
                }
            );

            stream.end(file.buffer);
        });

    res.status(200).json({ url: result.secure_url });


    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
        return;
    }
}