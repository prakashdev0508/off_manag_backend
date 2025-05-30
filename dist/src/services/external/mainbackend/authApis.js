"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccssToken = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_API_URL = process.env.MAIN_BACKEND_URL;
const BASE_CRM_DASHBOARD_URL = BASE_API_URL + "/crm_dashboard/v1/admin";
const getAccssToken = async (payload) => {
    try {
        const response = await axios_1.default.post(`${BASE_CRM_DASHBOARD_URL}/employees/authenticate_google_oauth`, JSON.stringify(payload), {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        console.log("yaha wala", error.response.data.errors[0]);
        throw (error.response.data.errors[0] || "Error getting access token");
    }
};
exports.getAccssToken = getAccssToken;
