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

router.post("/create", authMiddleware(["SCHOOL"]), newExamination);
router.get("/all", authMiddleware(["SCHOOL"]), getAllExaminations);
router.get("/class/:classId", authMiddleware(["SCHOOL","STUDENT","TEACHER"]), getExaminationByClass);
router.patch("/update/:examinationId", authMiddleware(["SCHOOL"]), updateExamination);
router.delete("/delete/:examinationId", authMiddleware(["SCHOOL"]), deleteExamination);

export default router;
