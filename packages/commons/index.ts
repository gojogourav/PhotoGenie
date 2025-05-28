// apps/api/index.ts
import express from "express";

const app = express();
const PORT = process.env.PORT || 8081;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
