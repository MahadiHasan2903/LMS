import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayoutController,
  editLayoutController,
  getLayoutByTypeController,
} from "../controllers/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  createLayoutController
);

layoutRouter.put(
  "/edit-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  editLayoutController
);

layoutRouter.get("/get-layout", getLayoutByTypeController);

export default layoutRouter;
