import express from "express";

import {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByClass,
  checkAttendance,
} from "../controllers/attendance.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/mark", authMiddleware(["TEACHER"]), markAttendance);
router.get("/student/:studentId", authMiddleware(["SCHOOL"]), getAttendanceByStudent);
router.get("/class/:classId", authMiddleware(["SCHOOL", "TEACHER"]), getAttendanceByClass);
router.get("/check/:classId", authMiddleware(["SCHOOL", "TEACHER"]), checkAttendance);

export default router;
