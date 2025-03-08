import express from "express";

import {
  getStudents,
  getStudentById,
  getStudentOwnData,
  getStudentWithQuery,
  createStudent,
  loginStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/login", authMiddleware(["STUDENT", "SCHOOL"]), loginStudent);
router.post("/create", authMiddleware(["STUDENT", "SCHOOL"]), createStudent);
router.get("/fetch/:id", authMiddleware(["STUDENT", "SCHOOL"]), getStudentById);
router.get("/fetch-single", authMiddleware(["STUDENT", "SCHOOL"]), getStudentOwnData);
router.get("/all", authMiddleware(["STUDENT", "SCHOOL"]), getStudents);
router.get("/search", authMiddleware(["STUDENT", "SCHOOL"]), getStudentWithQuery);
router.patch("/update/:id", authMiddleware(["STUDENT", "SCHOOL"]), updateStudent);
router.delete("/delete/:id", authMiddleware(["STUDENT", "SCHOOL"]), deleteStudent);

export default router;
