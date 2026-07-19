import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(); // Tanpa embel-embel adapter atau konfigurasi aneh

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;