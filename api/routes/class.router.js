import express from "express";

import {
  getClasses,
  getSingleClass,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createClass);
router.get("/all", authMiddleware(["SCHOOL", "STUDENT"]), getClasses);
router.get("/single/:id", authMiddleware(["SCHOOL", "STUDENT"]), getSingleClass);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateClass);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteClass);

export default router;
