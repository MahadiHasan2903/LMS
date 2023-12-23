import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotificationController, updateNotificationController } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotificationController
);

notificationRouter.put(
    "/update-notification/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    updateNotificationController
  );

export default notificationRouter;
