import express from 'express'
import { PrismaClient } from './generated/prisma';
const app = express();
const PORT = process.env.PORT||8083;
app.use(express.json());
import { Request,Response } from 'express';

export const prisma = new PrismaClient();


app.listen(PORT,()=>{
    console.log("server is listening at http://localhost:8083");
    
})