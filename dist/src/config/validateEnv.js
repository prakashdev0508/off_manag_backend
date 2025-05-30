"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ["development", "production", "test", "staging", "uat"],
        }),
        PORT: (0, envalid_1.port)({ default: 5000 }),
        DATABASE_URL: (0, envalid_1.url)(),
        JWT_SECRET: (0, envalid_1.str)(),
    });
};
exports.validateEnv = validateEnv;
