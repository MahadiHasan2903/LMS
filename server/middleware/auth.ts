import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import dotenv from "dotenv";
import { redis } from "../config/redis";
dotenv.config();

// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);

// authorize roles middleware
export const authorizeRoles = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user && user.role === role) {
      next();
    } else {
      console.log("Unauthorized");
      return next(new ErrorHandler("Unauthorized", 403));
    }
  };
};
