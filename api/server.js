import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import connectDB from "./config/connectDB.js";

import schoolRouter from "./routes/school.router.js";
import classRouter from "./routes/class.router.js";
import subjectRouter from "./routes/subject.router.js";
import studentRouter from "./routes/student.router.js";
import teacherRouter from "./routes/teacher.router.js";
import scheduleRouter from "./routes/schedule.router.js";
import attendanceRouter from "./routes/attendance.router.js";
import examinationRouter from "./routes/examination.router.js";
import noticeRouter from "./routes/notice.router.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: "Authorization",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/test", (req, res) => {
  res.send(path.resolve());
});

app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/examination", examinationRouter);
app.use("/api/notice", noticeRouter);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
