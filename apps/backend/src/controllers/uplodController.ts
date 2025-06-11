import { Response } from "express"
import { AuthenticationRequest } from "../middleware/auth";
import cloudinary from "../utils/cloudinary";
import { Readable } from 'stream'
interface CloudinaryResult {
    public_id: string,
    bytes: number,
}

const MINIMUM_IMAGES = 20;

const uploadController = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    const userId = req.user?.id
    const uploadTag = `${userId}/${crypto.randomUUID()}`
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length < MINIMUM_IMAGES) {
            res.status(400).json({ message: "No files uploaded" });
            return;
        }

        const uploadResult: CloudinaryResult[] = await Promise.all(
            files.map(
                (file) => new Promise<CloudinaryResult>((resolve, reject) => {
                    const upload_stream = cloudinary.uploader.upload_stream(
                        {
                            folder: `users/uploads/${userId}/${uploadTag}`,
                            use_filename: true,
                        },
                        (error, result) => {
                            if (error || !result) return reject(error || new Error("Upload has failed"));
                            resolve({
                                public_id: result.public_id,
                                bytes: result.bytes,
                            })
                        }
                    )
                    Readable.from(file.buffer).pipe(upload_stream);
                })
            )
        );

        res.status(200).json({ uploaded: uploadResult })
        return;
    } catch (error) {
        console.error("Upload Error", error);
        res.status(500).json({
            message: "Server error during upload",
            trainingTag: uploadTag

        })
        return;
    }
};


export default uploadController;