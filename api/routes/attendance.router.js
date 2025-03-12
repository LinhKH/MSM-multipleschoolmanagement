import express from "express";

import {
  markAttendance,
  getAttendanceByStudent,
  checkAttendance,
} from "../controllers/attendance.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/mark", authMiddleware(["TEACHER"]), markAttendance);
router.get("/student/:studentId", authMiddleware(["SCHOOL"]), getAttendanceByStudent);
router.get("/check/:classId", authMiddleware(["SCHOOL"]), checkAttendance);

export default router;
