// apps/api/index.ts
import express from "express";
import { TrainingModels, GenerateImage, OutputImages } from "commons/types"
import { prismaClient } from "db";
import router from "./routes/uploadRoute";


const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json())

app.post("ai/train", async (req, res) => {
  const parsedBody = TrainingModels.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Please enter valid input"
    })
    return
  }

  const data = await prismaClient.model.create({
    data: {
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethenicity: parsedBody.data.ethenicity,
      isBald: parsedBody.data.isBald,
      eyeColor: parsedBody.data.eyeColor,
      name: parsedBody.data.name
    }
  })

  res.json({
    modelId:data.id
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
