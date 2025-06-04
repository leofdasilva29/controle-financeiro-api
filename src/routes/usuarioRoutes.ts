// =======================
// ARQUIVO: usuarioRoutes.ts
// FINALIDADE: Definição das rotas HTTP para o recurso de usuários
// =======================

import { Router } from 'express';
import * as controller from '../controllers/usuarioController';

const router = Router();

// =======================
// Rota GET para listar todos os usuários
// =======================
router.get('/usuarios', controller.listarUsuarios);

// =======================
// Rota POST para criar um novo usuário
// =======================
router.post('/usuarios', controller.criarUsuario);

// =======================
// Rota PUT para atualizar um usuário existente
// =======================
router.put('/usuarios/:id', controller.atualizarUsuario);

// =======================
// Rota DELETE para remover um usuário pelo ID
// =======================
router.delete('/usuarios/:id', controller.deletarUsuario);

export default router;
