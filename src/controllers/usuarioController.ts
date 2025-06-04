// =======================
// ARQUIVO: usuarioRoutes.ts
// FINALIDADE: Definição das rotas HTTP para o recurso de usuários com tratamento completo
// =======================

import { Router } from 'express';
import * as controller from '../controllers/usuarioController';

const router = Router();

// =======================
// Rota GET para listar todos os usuários
// =======================
router.get('/usuarios', async (req, res) => {
  try {
    await controller.listarUsuarios(req, res);
  } catch (error: any) {
    res.status(500).json({
      erro: 'Erro interno na rota GET /usuarios',
      detalhes: {
        mensagem: error.message || 'Erro desconhecido',
        stack: error.stack || null
      }
    });
  }
});

// =======================
// Rota POST para criar um novo usuário
// =======================
router.post('/usuarios', async (req, res) => {
  try {
    await controller.criarUsuario(req, res);
  } catch (error: any) {
    res.status(500).json({
      erro: 'Erro interno na rota POST /usuarios',
      detalhes: {
        mensagem: error.message || 'Erro desconhecido',
        stack: error.stack || null
      }
    });
  }
});

// =======================
// Rota PUT para atualizar um usuário existente
// =======================
router.put('/usuarios/:id', async (req, res) => {
  try {
    await controller.atualizarUsuario(req, res);
  } catch (error: any) {
    res.status(500).json({
      erro: 'Erro interno na rota PUT /usuarios/:id',
      detalhes: {
        mensagem: error.message || 'Erro desconhecido',
        stack: error.stack || null
      }
    });
  }
});

// =======================
// Rota DELETE para remover um usuário pelo ID
// =======================
router.delete('/usuarios/:id', async (req, res) => {
  try {
    await controller.deletarUsuario(req, res);
  } catch (error: any) {
    res.status(500).json({
      erro: 'Erro interno na rota DELETE /usuarios/:id',
      detalhes: {
        mensagem: error.message || 'Erro desconhecido',
        stack: error.stack || null
      }
    });
  }
});

export default router;
