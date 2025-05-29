// apps/api/index.ts
import express from "express";
import { TrainingModels, GenerateImage, OutputImages } from "commons/types"
import {prisma}  from "db/index";
import router from "./routes/uploadRoute";
import * as z from 'zod'


const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json())

app.post("/ai/train", async (req, res) => {
  
  type TrainingModelsType = z.infer<typeof TrainingModels> 
  const parsedBody = TrainingModels.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please enter valid input"
    })
    return
  }
  const data: TrainingModelsType = parsedBody.data;


  const model = await prisma.model.create({
    data: {
      type: data.type,
      age:data.age,
      ethenicity: data.ethenicity,
      isBald: data.isBald,
      eyeColor: data.eyeColor,
      name: data.name,
      packId:data.packId,
    }
  })

  res.json({
    modelId:model.id
  })
  return;
})


app.use('/api', router);


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
