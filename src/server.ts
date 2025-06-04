import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import usuarioRoutes from './routes/usuarioRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use(usuarioRoutes);

// Rota raiz de teste
app.get('/', (req, res) => {
  res.send('API Controle Financeiro Rodando ✅');
});

// Correto para o Railway
const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
