import { NextRequest } from "next/server";
import { verifyJwtToken } from "./credential.helpers";

export const getDataFromToken = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = verifyJwtToken(token) as { sub?: string };
    return decodedToken?.sub || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
