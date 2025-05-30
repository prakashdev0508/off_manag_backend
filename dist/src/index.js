"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const dbconfig_1 = require("./config/db/dbconfig");
const logger_1 = require("./config/logger");
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        const server = (0, http_1.createServer)(app_1.app);
        server.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port http://localhost:${PORT}`);
        });
        // Handle server shutdown
        process.on('SIGTERM', async () => {
            logger_1.logger.info('SIGTERM received. Closing HTTP server and database connection');
            await dbconfig_1.prisma.$disconnect();
            process.exit(0);
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to start server:", error);
        await dbconfig_1.prisma.$disconnect();
        process.exit(1);
    }
}
startServer();
