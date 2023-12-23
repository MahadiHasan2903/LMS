import { NextFunction, Response } from "express";
import Course from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";

export const createCourse = CatchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    try {
      console.log("Creating course with data:", data);
      const course = await Course.create(data);
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log("Error", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Get all course
export const getAllCourse = async (res: Response) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    courses,
  });
};
