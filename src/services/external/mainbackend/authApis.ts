import axios from "axios";

const BASE_API_URL = process.env.MAIN_BACKEND_URL;
const BASE_CRM_DASHBOARD_URL = BASE_API_URL + "/crm_dashboard/v1/admin";

export const getAccssToken = async (payload: any) => {
  try {
    const response = await axios.post(
      `${BASE_CRM_DASHBOARD_URL}/employees/authenticate_google_oauth`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error: any) {
    console.log( "yaha wala" ,  error.response.data.errors[0]);
    throw(error.response.data.errors[0] || "Error getting access token");
  }
};
