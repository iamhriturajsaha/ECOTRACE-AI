import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

const getPrismaClient = () => {
  let connectionString = process.env.DATABASE_URL || "";
  if (!connectionString.startsWith("postgresql://") && !connectionString.startsWith("postgres://")) {
    connectionString = "postgresql://postgres:postgres@localhost:5432/ecotrace";
  }
  
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  
  const adapter = new PrismaPg(globalForPrisma.pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

globalForPrisma.prisma = prisma;
