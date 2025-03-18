import express from "express";

import {
  registerSchool,
  loginSchool,
  getAllSchools,
  getSchoolById,
  updateSchoolById,
  getSchoolDashboardOverview,
  enrollmentStats,
  attendanceStats,
} from "../controllers/school.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchools);
router.post("/login", loginSchool);
router.patch("/update", authMiddleware(['SCHOOL']), updateSchoolById);
router.get("/fetch-single", authMiddleware(['SCHOOL']),  getSchoolById);
router.get("/dashboard/overview", authMiddleware(['SCHOOL']),  getSchoolDashboardOverview);
router.get("/dashboard/enrollment-stats", authMiddleware(['SCHOOL']),  enrollmentStats);
router.get("/dashboard/attendance-stats", authMiddleware(['SCHOOL']),  attendanceStats);

export default router;
