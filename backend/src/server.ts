import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import conversationRoute from "./routes/conversation.routes";

import path from "path";

import { app, httpServer } from "./sockets";

dotenv.config();
const PORT = Number(process.env.PORT) || 5001;

const corsOptions = {
  origin: [/.*/],
  credentials: true,
};
if (process.env.NODE_ENV === "production") app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const MONGO_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversations", conversationRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
