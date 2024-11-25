import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import dotenv from "dotenv";
import { IUserRequest } from "../definitionfile";

dotenv.config();

export const authenticateJWT = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  const secret = process.env.JWT_SECRET as string;

  if (!secret) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  try {
    const { userId: _id } = jwt.verify(token, secret) as JwtPayload;

    const user = (await User.findById(_id)) as IUser;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = {
      id: user._id as string,
      fullName: user.fullName,
      email: user.email,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
