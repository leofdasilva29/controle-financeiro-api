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
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Adiciona logs para debug
});

// Configurações do Express (Middlewares)
app.use(cors()); // Permite acesso de qualquer origem (CORS)
app.use(express.json()); // Permite que a API receba JSON no body das requisições

// ========================================
// TESTE DE CONEXÃO COM O BANCO
// ========================================
async function testeDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Testa uma query simples
    const count = await prisma.usuarios.count();
    console.log(`📊 Total de usuários no banco: ${count}`);
  } catch (erro) {
    console.error('❌ Erro ao conectar com o banco de dados:', erro);
    console.error('Verifique sua DATABASE_URL e a conexão com o Supabase');
  }
}

// Chama o teste de conexão ao iniciar
testeDatabaseConnection();

// ========================================
// ROTA DE TESTE - Verifica se a API está online
// ========================================
app.get('/', (req, res) => {
  res.json({
    mensagem: '🚀 API de Controle Financeiro está online!',
    versao: '1.0.0',
    status: 'OK',
    endpoints: {
      usuarios: '/usuarios',
      categorias: '/categorias',
      contas: '/contas',
      moedas: '/moedas'
    }
  });
});

// ========================================
// IMPORTAÇÃO DAS ROTAS
// ========================================
// Por enquanto, vamos manter as rotas no mesmo arquivo
// Depois organizaremos em arquivos separados

// ========================================
// ROTAS DE USUÁRIOS
// ========================================

// GET /usuarios - Lista todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    console.log('Buscando usuários...');
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
    
    console.log(`Encontrados ${usuarios.length} usuários`);
    res.json({
      sucesso: true,
      total: usuarios.length,
      dados: usuarios
    });
  } catch (erro) {
    console.error('Erro detalhado ao buscar usuários:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar usuários',
      detalhes: erro.message 
    });
  }
});

// POST /usuarios - Cria um novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;
    
    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        sucesso: false,
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

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      dados: novoUsuario
    });
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro);
    if (erro.code === 'P2002') {
      res.status(400).json({ 
        sucesso: false,
        erro: 'Email já cadastrado' 
      });
    } else {
      res.status(500).json({ 
        sucesso: false,
        erro: 'Erro ao criar usuário',
        detalhes: erro.message 
      });
    }
  }
});

// ========================================
// ROTAS DE MOEDAS
// ========================================

// GET /moedas - Lista todas as moedas
app.get('/moedas', async (req, res) => {
  try {
    const moedas = await prisma.moedas.findMany({
      orderBy: {
        padrao: 'desc' // Moeda padrão primeiro
      }
    });
    res.json({
      sucesso: true,
      total: moedas.length,
      dados: moedas
    });
  } catch (erro) {
    console.error('Erro ao buscar moedas:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar moedas',
      detalhes: erro.message 
    });
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
    res.json({
      sucesso: true,
      total: categorias.length,
      dados: categorias
    });
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar categorias',
      detalhes: erro.message 
    });
  }
});

// POST /categorias - Cria uma nova categoria
app.post('/categorias', async (req, res) => {
  try {
    const { nome, tipo, usuario_id } = req.body;
    
    // Validação
    if (!nome || !tipo || !usuario_id) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Nome, tipo e usuário são obrigatórios' 
      });
    }

    // Valida o tipo
    if (!['receita', 'despesa', 'transferencia'].includes(tipo)) {
      return res.status(400).json({ 
        sucesso: false,
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

    res.status(201).json({
      sucesso: true,
      mensagem: 'Categoria criada com sucesso',
      dados: novaCategoria
    });
  } catch (erro) {
    console.error('Erro ao criar categoria:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao criar categoria',
      detalhes: erro.message 
    });
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
    res.json({
      sucesso: true,
      total: contas.length,
      dados: contas
    });
  } catch (erro) {
    console.error('Erro ao buscar contas:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar contas',
      detalhes: erro.message 
    });
  }
});

// POST /contas - Cria uma nova conta
app.post('/contas', async (req, res) => {
  try {
    const { nome, tipo, saldo_inicial, usuario_id, moeda_id } = req.body;
    
    // Validação
    if (!nome || !usuario_id) {
      return res.status(400).json({ 
        sucesso: false,
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

    res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso',
      dados: novaConta
    });
  } catch (erro) {
    console.error('Erro ao criar conta:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao criar conta',
      detalhes: erro.message 
    });
  }
});

// ========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ========================================
app.use((req, res) => {
  res.status(404).json({ 
    sucesso: false,
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
