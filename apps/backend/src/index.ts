// apps/api/index.ts
import express from "express";
import { TrainingModels, GenerateImage, OutputImages } from "commons/types"
import {prisma}  from "db/index";
import router from "./routes/uploadRoute";
import * as z from 'zod'
import dotenv from 'dotenv'
import authRoute from "./routes/authRoute";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authMiddleware } from "./middleware/auth";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;


app.use(express.json())
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
app.use(cookieParser());



app.use('/api/user',authRoute);
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
