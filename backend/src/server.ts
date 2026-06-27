import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';
import { logger } from './utils/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('Express server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma disconnected successfully.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during Prisma disconnection:', error as Error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
