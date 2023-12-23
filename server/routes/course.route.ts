import express from "express";

import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  editCourseController,
  getSingleCourseController,
  uploadCourseController,
  getAllCourseController,
  getCourseByUserController,
  addQuestionController,
  addAnswerController,
  addReviewController,
  addReplayToReviewController,
  getAllCoursesController,
  deleteCourseController,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourseController
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourseController
);

courseRouter.get("/get-course/:id", getSingleCourseController);
courseRouter.get("/get-courses", getAllCourseController);
courseRouter.get(
  "/get-course-content/:id",
  isAuthenticated,
  getCourseByUserController
);

courseRouter.put("/add-question", isAuthenticated, addQuestionController);

courseRouter.put("/add-answer", isAuthenticated, addAnswerController);

courseRouter.put("/add-review/:id", isAuthenticated, addReviewController);

courseRouter.put(
  "/add-replay",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplayToReviewController
);

courseRouter.get(
  "/get-all-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCoursesController
);

courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourseController
);
export default courseRouter;
