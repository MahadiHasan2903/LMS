import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createOrderController,
  getAllOrdresController,
} from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrderController);

orderRouter.get(
  "/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrdresController
);

export default orderRouter;
