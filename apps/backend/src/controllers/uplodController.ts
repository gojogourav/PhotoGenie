import { Request, Response } from "express"
import cloudinary, { cloudinaryOptions } from "../utils/cloudinary";
const uploadController = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file upload ." })
            return;
        }
        if (!req.file.mimetype.startsWith("image/")) {
            res.status(400).json({ message: "Only image files are allowed." });
            return;
        }

        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'user',
                ...cloudinaryOptions
            },
                (error, result) => {
                    if (error) {
                        console.error("cloudinary upload error", error)
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )

            uploadStream.end(req.file?.buffer);
        });
        const result: any = await uploadPromise;

        res.status(200).json({
            message: "File uploaded successfully to Cloudinary!",
            url: result.secure_url,
            public_id: result.public_id,
            asset_id: result.asset_id
        })
    } catch (error) {
        console.error("Server upload error", error)
        res.status(500).json({ message: 'Failed to upload image' })
    }
}

export default uploadController;