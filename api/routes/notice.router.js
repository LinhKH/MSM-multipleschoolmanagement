import express from "express";

import {
  newNotice,
  getAllNotices,
  getNoticenByAudience,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller.js";

import { authMiddleware } from "../auth/auth.js";
const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), newNotice);
router.get("/all", authMiddleware(["SCHOOL"]), getAllNotices);
router.post(
  "/audience",
  authMiddleware(["SCHOOL", "STUDENT", "TEACHER"]),
  getNoticenByAudience
);
router.patch("/update/:noticeId", authMiddleware(["SCHOOL"]), updateNotice);
router.delete("/delete/:noticeId", authMiddleware(["SCHOOL"]), deleteNotice);

export default router;
