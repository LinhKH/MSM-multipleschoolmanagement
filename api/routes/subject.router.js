import express from "express";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSubject);
router.get("/all", authMiddleware(["SCHOOL", "TEACHER"]), getSubjects);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateSubject);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteSubject);

export default router;
