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

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;


app.use(express.json())
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
app.use(cookieParser());

app.post("/ai/train", async (req, res) => {
  
  const parsedBody = TrainingModels.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please enter valid input"
    })
    return
  }


  const model = await prisma.model.create({
    data: {
      type: parsedBody.data.type,
      age:parsedBody.data.age,
      ethenicity: parsedBody.data.ethenicity,
      isBald: parsedBody.data.isBald,
      eyeColor: parsedBody.data.eyeColor,
      name: parsedBody.data.name,
      packId:parsedBody.data.packId,
    }
  })

  res.json({
    modelId:model.id
  })
  return;
})


app.use('/api', router);

app.use('/api/user',authRoute);
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
