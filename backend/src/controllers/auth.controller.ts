import User, { IUser } from "../models/user.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { fullName, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: "Email Already Exists" });
  }
  const user = new User({ fullName, email, password });
  try {
    const newUser = await user.save();
    const accessToken = generateAccessToken(newUser);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({ data: newUser });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Bad Request" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.isValidPassword(password)))
    return res
      .status(401)
      .json({ message: "Incorrect email or password. Please try again." });

  const accessToken = generateAccessToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({ message: "Login Successful", data: user });
};

export const generateAccessToken = (user: IUser): string => {
  const accessTokenSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRY;

  if (!accessTokenSecret || !expiresIn)
    throw new Error("Environment Variables Not Set");

  const payload = {
    userId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, accessTokenSecret, { expiresIn });
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged Out" });
};
