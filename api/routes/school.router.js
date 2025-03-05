import express from "express";

import {
  registerSchool,
  loginSchool,
  getAllSchools,
  getSchoolById,
  updateSchoolById,
} from "../controllers/school.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchools);
router.post("/login", loginSchool);
router.patch("/update", authMiddleware(['SCHOOL']), updateSchoolById);
router.get("/fetch-single", authMiddleware(['SCHOOL']),  getSchoolById);

export default router;
