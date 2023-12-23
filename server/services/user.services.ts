import { Response } from "express";
import { redis } from "../config/redis";
import User from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";

// Get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

//Get all user
export const getAllUser = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

//Update user role ---> only for admin
export const updateUserRole = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  res.status(201).json({
    success: true,
    user,
  });
};
