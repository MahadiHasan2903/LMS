import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  // Wrong MongoDB  id error
  if (error.name === "CastError") {
    const message = `Resource no found. Inavalid ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  //Duplicate Key Error

  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }
  // Wrong JWT error
  if (error.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new ErrorHandler(message, 401); // 401 Unauthorized status code
  }
  // JWT expire error
  if (error.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again.";
    error = new ErrorHandler(message, 401); // 401 Unauthorized status code
  }
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

//JWT expire error
