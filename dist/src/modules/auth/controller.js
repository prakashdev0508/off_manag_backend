"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authApis_1 = require("../../services/external/mainbackend/authApis");
const dbconfig_1 = require("../../config/db/dbconfig");
const messageResponse_1 = require("../../utils/messageResponse");
const auth_schema_1 = require("../../schema/auth.schema");
/**
 * @access Public
 * @route POST /auth/login
 * @description Login with Google ID Token
 * @returns {object} - User data and token
 */
const login = async (req, res, next) => {
    try {
        const { googleIdToken } = req.body;
        if (!googleIdToken) {
            return next((0, messageResponse_1.createError)(400, "Google ID Token is required"));
        }
        if (typeof googleIdToken !== "string") {
            return next((0, messageResponse_1.createError)(400, "Google ID Token must be a string"));
        }
        const userData = await (0, authApis_1.getAccssToken)({
            google_token: googleIdToken,
        });
        if (!userData) {
            return next((0, messageResponse_1.createError)(401, "Invalid Google ID Token"));
        }
        const user = await dbconfig_1.prisma.user.findUnique({
            where: {
                email: userData.data.employee.email,
            },
        });
        if (!user) {
            return next((0, messageResponse_1.createError)(401, "User not found"));
        }
        if (user.is_active === false) {
            return next((0, messageResponse_1.createError)(401, "User is not active"));
        }
        await dbconfig_1.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                external_token: userData.data.token,
                external_id: String(userData.data.employee.id),
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET || "secret_token_incase_of_not_found_of_token");
        (0, messageResponse_1.createSuccess)(res, "Login Successfully", {
            token,
            role: user.roles,
        });
    }
    catch (error) {
        next((0, messageResponse_1.createError)(403, String(error)));
    }
};
exports.login = login;
/**
 * @access Private
 * @description Register user with email
 * @route POST /auth/register
 * @returns {object} - Message with user id
 */
const register = async (req, res, next) => {
    try {
        const { email, name, roles, external_id, external_token, user_type, manager_id, is_active, } = auth_schema_1.registerSchema.parse(req.body);
        const existingUser = await dbconfig_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return next((0, messageResponse_1.createError)(400, "User already exists with this email"));
        }
        const newUser = await dbconfig_1.prisma.user.create({
            data: {
                email,
                name,
                roles,
                external_id,
                external_token,
                user_type,
                manager_id,
                is_active,
            },
        });
        if (!newUser) {
            return next((0, messageResponse_1.createError)(400, "Failed to create user"));
        }
        (0, messageResponse_1.createSuccess)(res, "User created successfully", {
            id: newUser.id,
        });
    }
    catch (error) {
        next((0, messageResponse_1.createError)(403, error || "Something went wrong in register"));
    }
};
exports.register = register;
