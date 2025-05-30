import { createServer } from "http";
import { app } from "./app";
import { prisma } from "./config/db/dbconfig";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Database connection established");

    const server = createServer(app);
    
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port http://localhost:${PORT}`);
    });

    // Handle server shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received. Closing HTTP server and database connection');
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
