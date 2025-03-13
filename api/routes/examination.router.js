import express from "express";

import {
  newExamination,
  getAllExaminations,
  getExaminationByClass,
  updateExamination,
  deleteExamination,
} from "../controllers/examination.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL", "TEACHER"]), newExamination);
router.get("/all", authMiddleware(["SCHOOL", "TEACHER"]), getAllExaminations);
router.get("/class/:classId", authMiddleware(["SCHOOL","STUDENT","TEACHER"]), getExaminationByClass);
router.patch("/update/:examinationId", authMiddleware(["SCHOOL", "TEACHER"]), updateExamination);
router.delete("/delete/:examinationId", authMiddleware(["SCHOOL", "TEACHER"]), deleteExamination);

export default router;
