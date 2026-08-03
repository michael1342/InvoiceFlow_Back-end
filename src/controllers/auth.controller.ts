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

const signInToken = (userId : StringConstructor) => jwt.sign({userId }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })

exports.register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role, companyName }: RegisterBody = req.body;
        if (!name || !email || !password || !companyName) {
            return next(new Error('All fields are required'));
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return next(new Error('User already exists'));
        }
        const user = await User.create({ name, email, password, role, companyName });
        const token = signInToken(user._id);

        res.status(201).json({ token, user, message: "User created successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
        next(error);
    }
}

exports.login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new Error('All fields are required'));
        }

        const user = await User.findOne({ email }).select('+password')

        const businessMember = await BusinessMember.findOne({email}).select('+password');


        // if (!UserActivation && !businessMember) {
        //     return next(new Error('User not found'));
        // }
        // console.log(isMatch)

        const isMatch = await user?.comparePassword(password) || await bcrypt.compare(password, businessMember.password);
       
        if (!isMatch) {
            return next(new Error('Invalid credentials'));
        }

        if (user?.status === 'suspended' || businessMember?.status === 'suspended') return next(new Error('account has been deactivated. contact support'));
        await User.findByIdAndUpdate(user?._id, { lastLogin: Date.now() }) 
        await BusinessMember.findByIdAndUpdate(businessMember?._id, { lastLogin: Date.now() })

        const token = signInToken(user?._id);

        res.status(200).json({ token, User: user? user : businessMember, message: "User logged in successfully" });

        // user.accountStatus = 'active';
        await user?.save();
        await businessMember?.save();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProfile = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if(!user) {
            return next(new Error('User not found'));
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user?.id).select('+password');
        const isMatch = await user.comparePassword(currentPassword);
        if(!isMatch) return next(new Error('Invalid credentials'));

       res.status(200).json({ message: "Password changed successfully" });
        user.password = newPassword; 
        user.passwordChangedAt = Date.now();
        await user.save();
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        // const user = await User.findById(req.user.id);
        const user = await User.findById(req.user?.id);
        
       const token = req.cookies.token

     if(!user) {
        return next(new Error('User not found'));
     }

     if(!user.accountstatus) {
         return next(new Error('user is logged out'))
     }

     res.clearCookie('token')

     user.accountstatus = 'inactive'
     await user.save()

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        next(error);
    }
}