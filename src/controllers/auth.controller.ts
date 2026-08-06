import { Application, NextFunction } from "express";
import { RegisterBody } from "../interfaces";
const User = require("../models/User");
const Business = require('../models/business');
const BusinessMember = require('../models/businessMember');
import express, { Request, Response } from "express";
const app: Application = express();
app.use(express.json())
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const signInToken = (userId: string) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })
const refreshToken = (userId: string) => jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN })

exports.register = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const { name, email, password, role, companyName }: RegisterBody = req.body;
        if (!name || !email || !password || !companyName) {
            //  next(new Error('All fields are required'));
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role, companyName });
        const token = signInToken(user._id);

        return res.status(201).json({ token, user, message: "User created successfully" });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
        // next(error);
    }
}

exports.refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const { refreshToken } = req.cookies;
        console.log(req.cookies)

        if (!refreshToken) {
            console.log('refresh token is required')
            //  process.exit(2)
            return res.status(401).json({
                error: "Refresh token is required",
            });

        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )
        // console.logy

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                error: "User not found",
            });
        }

        if (user.status === "suspended") {
            return res.status(403).json({
                error: "Account suspended",
            });
        }

        const token = signInToken(user._id)

        return res.status(200).json({
            token,
        });
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Refresh token expired",
            });
        }

        return res.status(401).json({
            error: "Invalid refresh token",
        });
    }
}

exports.login = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            // return next(new Error('All fields are required'));
            console.log('all fields required')
            return res.status(400).json({ message: 'all fields required' })
        }

        const user = await User.findOne({ email }).select('+password')

        if (!user) return res.status(404).json({ message: 'user not found' })

        const businessMember = await BusinessMember.findOne({ email }).select('+password');

        const isMatch = await user?.comparePassword(password)

        if (!isMatch) return res.status(401).json({ message: 'invalid credentials' })
        // console.log('invalid credentials')


        if (user?.status === 'suspended' || businessMember?.status === 'suspended') return res.status(403).json({ message: 'account has been deactivated. contact support' })
        await User.findByIdAndUpdate(user?._id, { lastLogin: Date.now() })
        // await BusinessMember.findByIdAndUpdate(businessMember?._id, { lastLogin: Date.now() })

        const token = signInToken(user?._id);
        const refresh = refreshToken(user?._id);

        res.cookie("refreshToken", refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // add this
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // res.cookie('accessToken', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production'
        // })

        user.status = 'active'

        await user?.save();
        await businessMember?.save();
        const data = {
            token, refresh, User: user ? user : businessMember
        }

        return res.status(200).json({ data, message: "User logged in successfully" });

        // user.accountStatus = 'active';

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

exports.getProfile = async (req: any, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user?.id).select('+password');
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return next(new Error('Invalid credentials'));

        res.status(200).json({ message: "Password changed successfully" });
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        await user.save();
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req: any, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        // const user = await User.findById(req.user.id);
        const user = await User.findById(req.user?.id);

        const token = req.cookies.token
        const refreshToken = req.cookies.refreshToken

        if (!user) {
            return res.status(200).json({ message: 'user not found' })
        }

        if (user.status === 'inactive') {
            return res.status(200).json({ message: 'user is logged out' })
        }



        res.clearCookie('token')
       res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/" // Express defaults to '/' if not specified in your login code
        });



        user.status = 'inactive'
        await user.save()

        return res.status(200).json({ message: "User logged out successfully", user });
    } catch (error) {
        next(error);
    }
}