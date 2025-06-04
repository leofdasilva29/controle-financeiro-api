
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Controle Financeiro Rodando ✅');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
