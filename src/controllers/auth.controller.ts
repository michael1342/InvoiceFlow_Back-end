import Business from "../models/business";
import api from "../utils/responses";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface BusinessData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  owner: Record<string, unknown>;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      owner
    }: BusinessData = req.body;

    // create business here

  } catch (error) {
    next(error);
  }
};
export default {
  register
};