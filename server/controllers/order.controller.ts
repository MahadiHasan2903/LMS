import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Order, { IOrder } from "../models/order.model";
import Notification from "../models/notification.model";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import User from "../models/user.model";
import Course from "../models/course.model";
import { createOrder, getAllOrders } from "../services/order.services";

//create course
export const createOrderController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await User.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already enrolled in this course", 500)
        );
      }

      const course = await Course.findById(courseId);

      if (!course) {
        new ErrorHandler("Course not foun d", 500);
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course?._id.toString().slice(0, 6),
          name: course?.name,
          price: course?.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);
      await user?.save();
      await Notification.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      if (course?.purchased) {
        course.purchased += 1;
      }

      await course?.save();
      createOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get all course ---> only for admin
export const getAllOrdresController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrders(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
