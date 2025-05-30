"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lists_1 = require("../services/external/mainbackend/lists");
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.get("/property-list", authentication_1.verifyToken, lists_1.propertyList);
exports.default = router;
