import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error: Error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export const db = prisma;
