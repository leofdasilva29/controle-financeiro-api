// ========================================
// Arquivo: index.js
// Descrição: Servidor principal da API do Sistema de Controle Financeiro
// Autor: Léo
// Data: Dezembro 2024
// ========================================

// Importação das bibliotecas necessárias
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express'); // Framework para criar APIs REST
const cors = require('cors'); // Permite que o front-end acesse a API
const { PrismaClient } = require('@prisma/client'); // Cliente do banco de dados

// Inicialização do Express e Prisma
const app = express();
const prisma = new PrismaClient();

// Configurações do Express (Middlewares)
app.use(cors()); // Permite acesso de qualquer origem (CORS)
app.use(express.json()); // Permite que a API receba JSON no body das requisições

// ========================================
// ROTA DE TESTE - Verifica se a API está online
// ========================================
app.get('/', (req, res) => {
  res.json({
    mensagem: '🚀 API de Controle Financeiro está online!',
    versao: '1.0.0',
    status: 'OK'
  });
});

// ========================================
// ROTAS DE USUÁRIOS
// ========================================

// GET /usuarios - Lista todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        criado_em: true
        // Nota: nunca retornamos a senha por segurança
      }
    });
    res.json(usuarios);
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// POST /usuarios - Cria um novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;
    
    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Nome, email e senha são obrigatórios' 
      });
    }

    // Cria o usuário no banco
    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha, // TODO: implementar hash da senha com bcrypt
        tipo_usuario: tipo_usuario || 'comum'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        criado_em: true
      }
    });

    res.status(201).json(novoUsuario);
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro);
    if (erro.code === 'P2002') {
      res.status(400).json({ erro: 'Email já cadastrado' });
    } else {
      res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  }
});

// ========================================
// ROTAS DE CATEGORIAS
// ========================================

// GET /categorias - Lista todas as categorias
app.get('/categorias', async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany({
      orderBy: {
        nome: 'asc'
      }
    });
    res.json(categorias);
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

// POST /categorias - Cria uma nova categoria
app.post('/categorias', async (req, res) => {
  try {
    const { nome, tipo, usuario_id } = req.body;
    
    // Validação
    if (!nome || !tipo || !usuario_id) {
      return res.status(400).json({ 
        erro: 'Nome, tipo e usuário são obrigatórios' 
      });
    }

    // Valida o tipo
    if (!['receita', 'despesa', 'transferencia'].includes(tipo)) {
      return res.status(400).json({ 
        erro: 'Tipo deve ser: receita, despesa ou transferencia' 
      });
    }

    const novaCategoria = await prisma.categorias.create({
      data: {
        nome,
        tipo,
        usuario_id
      }
    });

    res.status(201).json(novaCategoria);
  } catch (erro) {
    console.error('Erro ao criar categoria:', erro);
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
});

// ========================================
// ROTAS DE CONTAS
// ========================================

// GET /contas - Lista todas as contas
app.get('/contas', async (req, res) => {
  try {
    const contas = await prisma.contas.findMany({
      include: {
        moedas: true // Inclui informações da moeda
      },
      orderBy: {
        nome: 'asc'
      }
    });
    res.json(contas);
  } catch (erro) {
    console.error('Erro ao buscar contas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar contas' });
  }
});

// POST /contas - Cria uma nova conta
app.post('/contas', async (req, res) => {
  try {
    const { nome, tipo, saldo_inicial, usuario_id, moeda_id } = req.body;
    
    // Validação
    if (!nome || !usuario_id) {
      return res.status(400).json({ 
        erro: 'Nome e usuário são obrigatórios' 
      });
    }

    const novaConta = await prisma.contas.create({
      data: {
        nome,
        tipo,
        saldo_inicial: saldo_inicial || 0,
        usuario_id,
        moeda_id
      },
      include: {
        moedas: true
      }
    });

    res.status(201).json(novaConta);
  } catch (erro) {
    console.error('Erro ao criar conta:', erro);
    res.status(500).json({ erro: 'Erro ao criar conta' });
  }
});

// ========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ========================================
app.use((req, res) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada',
    rota_solicitada: req.path 
  });
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ========================================
  🚀 Servidor iniciado com sucesso!
  🌐 URL: http://localhost:${PORT}
  📅 Data: ${new Date().toLocaleString('pt-BR')}
  ========================================
  `);
});

// Tratamento para encerramento gracioso
process.on('SIGTERM', async () => {
  console.log('⚠️ Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});