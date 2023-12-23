import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getCourseAnalyticesController, getOrderAnalyticesController, getUserAnalyticesController } from "../controllers/analytices.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalyticesController
);


analyticsRouter.get(
    "/get-courses-analytics",
    isAuthenticated,
    authorizeRoles("admin"),
    getCourseAnalyticesController
  );

  analyticsRouter.get(
    "/get-orders-analytics",
    isAuthenticated,
    authorizeRoles("admin"),
    getOrderAnalyticesController
  );

export default analyticsRouter;
