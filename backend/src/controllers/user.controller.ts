import { IUserRequest } from "../definitionfile";
import { Response } from "express";
import User from "../models/user.model";

export const getUserDetails = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  return res.status(200).json({ data: req.user });
};

export const getUsersBySearch = async (
  req: IUserRequest,
  res: Response
): Promise<any> => {
  const searchQuery = req.query.q as string;
  if (!searchQuery)
    return res.status(400).json({ message: "Missing search query" });
  const id = req.user!.id as string;
  try {
    const users = await User.findUsersByName(searchQuery, id);
    return res.status(200).json({ message: "Users found", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
