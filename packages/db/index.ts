import express from 'express'
import { PrismaClient } from './generated/prisma';
const app = express();
const PORT = process.env.PORT||8083;
app.use(express.json());

export const prisma = new PrismaClient();

