// =======================
// ARQUIVO: usuarioController.ts
// FINALIDADE: Controlar as rotas de requisição e resposta para o recurso "usuários"
// =======================

import { Request, Response } from 'express';
import * as usuarioService from '../services/usuarioService';

// =======================
// Lista todos os usuários
// =======================
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: error });
  }
};

// =======================
// Cria um novo usuário
// =======================
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const novo = await usuarioService.criar(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar usuário', detalhes: error });
  }
};

// =======================
// Atualiza um usuário pelo ID
// =======================
export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const atualizado = await usuarioService.atualizar(Number(id), req.body);
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário', detalhes: error });
  }
};

// =======================
// Deleta um usuário pelo ID
// =======================
export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await usuarioService.deletar(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao deletar usuário', detalhes: error });
  }
};
