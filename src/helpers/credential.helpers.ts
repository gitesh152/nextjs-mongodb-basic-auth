import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createJwtToken = (tokenPayload: any) => {
  return jwt.sign(tokenPayload, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY as StringValue,
  });
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
};

export const createRawToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const createHashedToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
