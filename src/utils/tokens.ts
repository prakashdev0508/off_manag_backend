import jwt from "jsonwebtoken";
import { createError } from "./messageResponse";

const JWT_SECRET =
  process.env.JWT_SECRET || "secret_token_incase_of_not_found_of_token";

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw createError(401, "Invalid access token");
  }
};
