import { Request, Response } from 'express';
import * as usuarioService from '../services/usuarioService';

export const listarUsuarios = async (req: Request, res: Response) => {
  const usuarios = await usuarioService.listar();
  res.json(usuarios);
};

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const novo = await usuarioService.criar(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar usuário', detalhes: error });
  }
};

export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const atualizado = await usuarioService.atualizar(Number(id), req.body);
    res.json(atualizado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário', detalhes: error });
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await usuarioService.deletar(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao deletar usuário', detalhes: error });
  }
};
