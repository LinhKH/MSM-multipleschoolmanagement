import express from 'express';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./config/connectDB.js";

import schoolRouter from './routes/school.router.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/school', schoolRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
