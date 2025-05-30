"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../modules/auth/controller");
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.post("/login", controller_1.login);
router.post("/register", authentication_1.verifyToken, (0, authentication_1.verifyRole)(["admin"]), controller_1.register);
exports.default = router;
