import dotenv from "dotenv";
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "../config/redis";

dotenv.config();

// Define the interface for token options
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Get token expiration times from environment variables
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "300",
  10
);

const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "1200",
  10
);

// Define options for access and refresh tokens
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Function to send tokens as cookies in the response
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Store the user data in Redis (replace with your actual logic)
  redis.set(user._id, JSON.stringify(user) as any);

  // Set the 'secure' option for access token in production
  if (process.env.NODE_MODE === "production") {
    accessTokenOptions.secure = true;
  }

  // Set cookies in the response with access and refresh tokens
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send a JSON response with success, user data, and access token
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
