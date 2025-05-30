"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = exports.verifyToken = void 0;
const messageResponse_1 = require("../utils/messageResponse");
const tokens_1 = require("../utils/tokens");
const dbconfig_1 = require("../config/db/dbconfig");
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next((0, messageResponse_1.createError)(401, "No token provided"));
        }
        const decoded = (0, tokens_1.verifyAccessToken)(token);
        if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
            return next((0, messageResponse_1.createError)(401, "Invalid or expired token"));
        }
        console.log("decoded", decoded);
        const user = await dbconfig_1.prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            return next((0, messageResponse_1.createError)(401, "User not found"));
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        return next((0, messageResponse_1.createError)(401, "Invalid token"));
    }
};
exports.verifyToken = verifyToken;
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = res.locals.user;
        if (!user || !user.roles) {
            return next((0, messageResponse_1.createError)(401, "Unauthorized - No user roles found"));
        }
        // Check if user has super_admin role
        if (user.roles.includes("super_admin")) {
            return next();
        }
        // Check if user has any of the allowed roles
        const hasAllowedRole = user.roles.some((userRole) => allowedRoles.includes(userRole));
        if (!hasAllowedRole) {
            return next((0, messageResponse_1.createError)(403, "Unauthorized"));
        }
        next();
    };
};
exports.verifyRole = verifyRole;
