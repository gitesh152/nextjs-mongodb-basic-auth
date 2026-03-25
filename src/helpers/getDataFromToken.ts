import { NextRequest } from "next/server";
import { verifyJwtToken } from "./credential.helpers";

export const getDataFromToken = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value || "";
  let decodedToken = null;
  try {
    decodedToken = verifyJwtToken(token);
  } catch (error) {
    decodedToken = null;
  }
  return decodedToken?.sub;
};
