// ========================================
// Arquivo: routes/usuarios.js
// Descrição: Rotas CRUD completas para usuários
// ========================================

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ========================================
// GET /usuarios - Listar todos os usuários
// ========================================
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        permite_lancamento_retroativo: true,
        criado_em: true
      },
      orderBy: {
        criado_em: 'desc'
      }
    });
    
    res.json({
      sucesso: true,
      total: usuarios.length,
      dados: usuarios
    });
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar usuários',
      detalhes: erro.message 
    });
  }
});

// ========================================
// GET /usuarios/:id - Buscar usuário por ID
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        permite_lancamento_retroativo: true,
        criado_em: true,
        // Incluir dados relacionados
        contas: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            saldo_inicial: true
          }
        },
        categorias: {
          select: {
            id: true,
            nome: true,
            tipo: true
          }
        }
      }
    });
    
    if (!usuario) {
      return res.status(404).json({ 
        sucesso: false,
        erro: 'Usuário não encontrado' 
      });
    }
    
    res.json({
      sucesso: true,
      dados: usuario
    });
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao buscar usuário',
      detalhes: erro.message 
    });
  }
});

// ========================================
// POST /usuarios - Criar novo usuário
// ========================================
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario } = req.body;
    
    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Nome, email e senha são obrigatórios' 
      });
    }
    
    // Verificar se email já existe
    const emailExiste = await prisma.usuarios.findUnique({
      where: { email }
    });
    
    if (emailExiste) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Email já cadastrado' 
      });
    }
    
    // Criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // Criar usuário
    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
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
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao criar usuário',
      detalhes: erro.message 
    });
  }
});

// ========================================
// PUT /usuarios/:id - Atualizar usuário
// ========================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, tipo_usuario, permite_lancamento_retroativo } = req.body;
    
    // Verificar se usuário existe
    const usuarioExiste = await prisma.usuarios.findUnique({
      where: { id }
    });
    
    if (!usuarioExiste) {
      return res.status(404).json({ 
        sucesso: false,
        erro: 'Usuário não encontrado' 
      });
    }
    
    // Se está alterando email, verificar duplicidade
    if (email && email !== usuarioExiste.email) {
      const emailExiste = await prisma.usuarios.findUnique({
        where: { email }
      });
      
      if (emailExiste) {
        return res.status(400).json({ 
          sucesso: false,
          erro: 'Email já está em uso' 
        });
      }
    }
    
    // Atualizar usuário
    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id },
      data: {
        nome: nome || usuarioExiste.nome,
        email: email || usuarioExiste.email,
        tipo_usuario: tipo_usuario || usuarioExiste.tipo_usuario,
        permite_lancamento_retroativo: permite_lancamento_retroativo !== undefined 
          ? permite_lancamento_retroativo 
          : usuarioExiste.permite_lancamento_retroativo
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        permite_lancamento_retroativo: true,
        criado_em: true
      }
    });
    
    res.json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
      dados: usuarioAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao atualizar usuário',
      detalhes: erro.message 
    });
  }
});

// ========================================
// DELETE /usuarios/:id - Deletar usuário
// ========================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se usuário existe
    const usuarioExiste = await prisma.usuarios.findUnique({
      where: { id }
    });
    
    if (!usuarioExiste) {
      return res.status(404).json({ 
        sucesso: false,
        erro: 'Usuário não encontrado' 
      });
    }
    
    // Deletar usuário (cascata automática para dados relacionados)
    await prisma.usuarios.delete({
      where: { id }
    });
    
    res.json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao deletar usuário:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao deletar usuário',
      detalhes: erro.message 
    });
  }
});

// ========================================
// POST /usuarios/:id/alterar-senha - Alterar senha
// ========================================
router.post('/:id/alterar-senha', async (req, res) => {
  try {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    
    // Validações
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ 
        sucesso: false,
        erro: 'Senha atual e nova senha são obrigatórias' 
      });
    }
    
    // Buscar usuário
    const usuario = await prisma.usuarios.findUnique({
      where: { id }
    });
    
    if (!usuario) {
      return res.status(404).json({ 
        sucesso: false,
        erro: 'Usuário não encontrado' 
      });
    }
    
    // Verificar senha atual
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    
    if (!senhaCorreta) {
      return res.status(401).json({ 
        sucesso: false,
        erro: 'Senha atual incorreta' 
      });
    }
    
    // Criptografar nova senha
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
    
    // Atualizar senha
    await prisma.usuarios.update({
      where: { id },
      data: {
        senha: novaSenhaCriptografada
      }
    });
    
    res.json({
      sucesso: true,
      mensagem: 'Senha alterada com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao alterar senha:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao alterar senha',
      detalhes: erro.message 
    });
  }
});

module.exports = router;