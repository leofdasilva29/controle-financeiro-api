import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listar = async () => {
  try {
    const usuarios = await prisma.usuarios.findMany();
    return usuarios;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
};

export const criar = async (dados: any) => {
  try {
    const novoUsuario = await prisma.usuarios.create({
      data: dados
    });
    return novoUsuario;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export const atualizar = async (id: number, dados: any) => {
  try {
    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id },
      data: dados
    });
    return usuarioAtualizado;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deletar = async (id: number) => {
  try {
    await prisma.usuarios.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};
