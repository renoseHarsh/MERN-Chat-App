import { Request } from "express";

interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface IUserRequest extends Request {
  user?: User; // or any other type
}
