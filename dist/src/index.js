"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const PORT = process.env.PORT || 5000;
const server = (0, http_1.createServer)(app_1.app);
server.listen(PORT, () => {
    console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
