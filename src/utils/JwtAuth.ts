/** @format */
import jwt from "jsonwebtoken";
import { HASHKEY } from "./hashKey";

export interface UserPayload {
  userId: number;
  email: string;
}

export const getUserFromToken = async (token: string) => {
  // check if user is authenticated
  try {
    const decodedToken = jwt.verify(token, HASHKEY) as UserPayload;
    return decodedToken;
  } catch (e) {
    return {
      error: {
        message: "You are not authenticated",
      },
    };
  }
};
