import type {Request} from "express";
const User = require("../models/User");

export type User = typeof User

export interface AppRequest extends Request {
    user: User;
}