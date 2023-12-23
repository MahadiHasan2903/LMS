import { NextFunction, Response } from "express";

import Course from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Order from "../models/order.model";

//Create order
export const createOrder = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await Order.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  }
);

//Get all course
export const getAllOrders = async (res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};
