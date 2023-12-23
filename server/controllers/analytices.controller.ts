import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLasttweleveMonthsData } from "../utils/analytices.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";

//Get users analytics ===> only for admin
export const getUserAnalyticesController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLasttweleveMonthsData(User);
      res.status(200).json({
        success: true,
        message: "User Analytics",
        users
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//Get courses analytics ===> only for admin
export const getCourseAnalyticesController = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const courses = await generateLasttweleveMonthsData(Course);
        res.status(200).json({
          success: true,
          message: "Course Analytics",
          courses
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  
//Get orders analytics ===> only for admin
export const getOrderAnalyticesController = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const orders = await generateLasttweleveMonthsData(Order);
        res.status(200).json({
          success: true,
          message: "Orders Analytics",
          orders
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );