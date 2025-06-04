// =======================
// ARQUIVO: usuarioService.ts
// FINALIDADE: Implementação das regras de negócio para o CRUD de usuários
// =======================

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// =======================
// Lista todos os usuários da tabela 'usuarios'
// =======================
export const listar = async () => {
  try {
    return await prisma.usuarios.findMany();
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw new Error('Erro interno ao listar usuários');
  }
};

// =======================
// Cria um novo usuário com base nos dados fornecidos
// =======================
export const criar = async (dados: any) => {
  try {
    return await prisma.usuarios.create({
      data: dados,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro interno ao criar usuário');
  }
};

// =======================
// Atualiza um usuário existente pelo ID
// =======================
export const atualizar = async (id: number, dados: any) => {
  try {
    return await prisma.usuarios.update({
      where: { id },
      data: dados,
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro interno ao atualizar usuário');
  }
};

// =======================
// Deleta um usuário pelo ID
// =======================
export const deletar = async (id: number) => {
  try {
    return await prisma.usuarios.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Erro interno ao deletar usuário');
  }
};
