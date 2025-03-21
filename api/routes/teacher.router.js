import express from "express";

import {
  getTeachers,
  getTeacherById,
  getTeacherOwnData,
  getTeacherWithQuery,
  createTeacher,
  loginTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/login", loginTeacher);
router.post("/create", authMiddleware(["SCHOOL"]), createTeacher);
router.get("/fetch/:id", authMiddleware(["SCHOOL"]), getTeacherById);
router.get("/fetch-single", authMiddleware(["TEACHER"]), getTeacherOwnData);
router.get("/all", authMiddleware(["SCHOOL", "TEACHER"]), getTeachers);
router.get("/search", authMiddleware(["SCHOOL"]), getTeacherWithQuery);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateTeacher);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteTeacher);

export default router;
