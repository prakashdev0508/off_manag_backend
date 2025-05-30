import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { createError, createSuccess } from "../../../utils/messageResponse";
import { Property } from "../../../types/lists";

const BASE_API_URL = process.env.MAIN_BACKEND_URL;
const BASE_CRM_DASHBOARD_URL = BASE_API_URL + "/crm_dashboard/v1/admin";

export const propertyList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user.external_token) {
      return next(createError(405, "User not found please login again"));
    }

    const response = await axios.get(
      `${BASE_CRM_DASHBOARD_URL}/properties?page=1&per_page=1000`,
      {
        headers: {
          Authorization: user.external_token,
        },
      }
    );

    const data = response.data.data.map((item: any) => {
      const property: Property = {
        id: item.id,
        ...(item.name && { name: item.name }),
        ...(item.city && { city_name: item.city }),
        ...(item.state_details.id && { state_id: item.state_details.id }),
        ...(item.cluster_details.id && { cluster_id: item.cluster_details.id }),
        ...(item.property_code && { property_code: item.property_code }),
      };
      return property;
    });

    createSuccess(res, "Property list fetched successfully", data);
  } catch (error) {
    next(createError(500, "Failed to fetch property list"));
  }
};
