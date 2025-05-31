"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const dbconfig_1 = require("../../config/db/dbconfig");
const user_schema_1 = require("../../schema/user.schema");
const messageResponse_1 = require("../../utils/messageResponse");
const updateUser = async (req, res, next) => {
    try {
        const { email, name, departments, roles, user_type, isActive, assigned_properties, } = user_schema_1.updateUserSchema.parse(req.body);
        const user = await dbconfig_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return next((0, messageResponse_1.createError)(404, "User not found"));
        }
        if (user.is_active === false) {
            return next((0, messageResponse_1.createError)(403, "User is not active"));
        }
        const updatedUser = await dbconfig_1.prisma.user.update({
            where: { email },
            data: {
                ...(name && { name }),
                ...(roles && { roles }),
                ...(user_type && { user_type }),
                ...(isActive !== undefined && { is_active: isActive }),
                ...(departments && {
                    departments: {
                        deleteMany: {},
                        create: departments.map((departmentId) => ({
                            departmentId: Number(departmentId),
                        })),
                    },
                }),
                ...(assigned_properties && {
                    assigned_properties: assigned_properties.map(Number),
                }),
            },
            include: {
                departments: {
                    include: {
                        department: true,
                    },
                },
            },
        });
        (0, messageResponse_1.createSuccess)(res, "User updated successfully", updatedUser);
    }
    catch (error) {
        return next((0, messageResponse_1.createError)(500, error));
    }
};
exports.updateUser = updateUser;
