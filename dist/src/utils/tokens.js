"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const messageResponse_1 = require("./messageResponse");
const JWT_SECRET = process.env.JWT_SECRET || "secret_token_incase_of_not_found_of_token";
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw (0, messageResponse_1.createError)(401, "Invalid access token");
    }
};
exports.verifyAccessToken = verifyAccessToken;
