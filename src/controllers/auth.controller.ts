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

const signInToken = (businessId : string, businessMemberId?: string) => jwt.sign({ businessId, businessMemberId }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })
const signUpToken = (businessMemberId: string) => jwt.sign({ businessMemberId }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })

exports.register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role, businessName }: RegisterBody = req.body;
        if (!name || !email || !password || !businessName) {
            return next(new Error('All fields are required'));
        }
        const existing = await Business.findOne({ email });
        if (existing) {
            return next(new Error('User already exists'));
        }
        const business = await Business.create({ name, email, password, role, businessName });
        const token = signInToken(business._id);

        res.status(201).json({ token, business, message: "User created successfully" });
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

        const business = await Business.findOne({ email }).select('+password')

        const businessMember = await BusinessMember.findOne({email}).select('+password');


        if (!business && !businessMember) {
            return next(new Error('User not found'));
        }
        // console.log(isMatch)

        const isMatch = await business?.comparePassword(password) || await bcrypt.compare(password, businessMember.password);
       
        if (!isMatch) {
            return next(new Error('Invalid credentials'));
        }

        if (business?.status === 'suspended' || businessMember?.status === 'suspended') return next(new Error('account has been deactivated. contact support'));
        await Business.findByIdAndUpdate(business?._id, { lastLogin: Date.now() }) 
        await BusinessMember.findByIdAndUpdate(businessMember?._id, { lastLogin: Date.now() })

        const token = signInToken(business?._id, businessMember?._id);

        res.status(200).json({ token, business: business? business : businessMember, message: "User logged in successfully" });

        // user.accountStatus = 'active';
        await business?.save();
        await businessMember?.save();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProfile = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const business = await Business.findById(req.user?.id);
        if(!business) {
            return next(new Error('User not found'));
        }
        res.status(200).json({ business });
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
        const business = await Business.findById(req.user?.id);
        
       const token = req.cookies.token

     if(!business) {
        return next(new Error('User not found'));
     }

     if(!business.accountstatus) {
         return next(new Error('user is logged out'))
     }

     res.clearCookie('token')

     business.accountstatus = 'inactive'
     await business.save()

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        next(error);
    }
}