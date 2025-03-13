import express from "express";

import {
  getScheduleWithClass,
  getScheduleWithId,
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSubject,
} from "../controllers/schedule.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSchedule);
router.get("/fetch-all", authMiddleware(["SCHOOL", "TEACHER"]), getAllSchedules);
router.get("/fetch-with-class/:class_id", authMiddleware(["SCHOOL", "TEACHER"]), getScheduleWithClass);
router.get("/single-fetch/:id", authMiddleware(["SCHOOL", "TEACHER"]), getScheduleWithId);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateSchedule);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteSubject);

export default router;
