import express from "express";
import {
  registrationController,
  activateUserController,
  loginUserController,
  logoutUserController,
  updateAccessToken,
  getUserInfoController,
  socialAuthController,
  updateUserInfoController,
  updateUserPasswordController,
  updateProfilePictureController,
  getAllUserController,
  updateUserRoleController,
  deleteUserController,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration", registrationController);
userRouter.post("/activate-user", activateUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/social-auth", socialAuthController);
userRouter.get("/logout", isAuthenticated, logoutUserController);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/loadUser", isAuthenticated, getUserInfoController);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfoController);
userRouter.put(
  "/update-user-password",
  isAuthenticated,
  updateUserPasswordController
);
userRouter.put(
  "/update-user-avatar",
  isAuthenticated,
  updateProfilePictureController
);

userRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUserController
);

userRouter.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRoleController
);
userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUserController
);

export default userRouter;
