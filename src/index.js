import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from './routes/users.js';
import { filmRouter } from './routes/films.js';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/films", filmRouter);


mongoose.connect(process.env.MONGODB_URI)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))