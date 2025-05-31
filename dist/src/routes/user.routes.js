"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../modules/auth/user.controller");
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.put("/update", authentication_1.verifyToken, (0, authentication_1.verifyRole)(["admin"]), user_controller_1.updateUser);
exports.default = router;
