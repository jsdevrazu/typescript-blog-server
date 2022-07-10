import { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  isActive: boolean;
  _doc: object;
}
export interface IComment extends Document {
  user: string;
  blog_id: string;
  blog_user_id: string;
  content: string;
  replyCM: string[];
  reply_user: string;
  _doc: object;
}

export interface IReqAuth extends Request {
  user?: IUser;
}
