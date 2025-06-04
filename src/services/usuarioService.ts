import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listar = async () => {
  return prisma.usuarios.findMany();
};

export const criar = async (data: any) => {
  return prisma.usuarios.create({ data });
};

export const atualizar = async (id: number, data: any) => {
  return prisma.usuarios.update({ where: { id }, data });
};

export const deletar = async (id: number) => {
  return prisma.usuarios.delete({ where: { id } });
};
