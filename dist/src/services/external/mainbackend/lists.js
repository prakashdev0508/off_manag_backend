"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyList = void 0;
const axios_1 = __importDefault(require("axios"));
const messageResponse_1 = require("../../../utils/messageResponse");
const BASE_API_URL = process.env.MAIN_BACKEND_URL;
const BASE_CRM_DASHBOARD_URL = BASE_API_URL + "/crm_dashboard/v1/admin";
const propertyList = async (req, res, next) => {
    try {
        const user = res.locals.user;
        if (!user.external_token) {
            return next((0, messageResponse_1.createError)(405, "User not found please login again"));
        }
        const response = await axios_1.default.get(`${BASE_CRM_DASHBOARD_URL}/properties?page=1&per_page=1000`, {
            headers: {
                Authorization: user.external_token,
            },
        });
        const data = response.data.data.map((item) => {
            const property = {
                id: item.id,
                ...(item.name && { name: item.name }),
                ...(item.city && { city_name: item.city }),
                ...(item.state_details.id && { state_id: item.state_details.id }),
                ...(item.cluster_details.id && { cluster_id: item.cluster_details.id }),
                ...(item.property_code && { property_code: item.property_code }),
            };
            return property;
        });
        (0, messageResponse_1.createSuccess)(res, "Property list fetched successfully", data);
    }
    catch (error) {
        next((0, messageResponse_1.createError)(500, "Failed to fetch property list"));
    }
};
exports.propertyList = propertyList;
