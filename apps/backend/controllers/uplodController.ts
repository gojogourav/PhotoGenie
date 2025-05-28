import cloudinary from "../utils/cloudinary";
import fs from 'fs'
import { Request,Response } from "express";

interface multerRequest extends Request{
    file?: Express.Multer.File;
}

export const uplaodImage = async (req:Request,res:Response)=>{
    try{
    const filePath = req.file?.path;
    if (!filePath) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    } 

    }catch(error){

    }
}