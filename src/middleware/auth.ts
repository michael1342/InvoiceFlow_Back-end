import express, { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/User");
const Business = require('../models/business');
const BusinessMember = require('../models/businessMember');
import type {AppRequest} from "../utils/request";
const {ROLES} = require('../constants/roles')

const Protect = async (req: AppRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const auth = req.headers.authorization
        if (!auth?.startsWith('Bearer')) {
            return next(new Error('unauthorized'));
        }
        const token = auth.split(' ')[1]
        req.cookies.token = token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

       const user = await User.findById(decoded.userId).select('+passwordChangedAt');
    //    const businessMember = await BusinessMember.findById(decoded.businessMemberId).select('+passwordChangedAt');
    //    console.log(businessMember)

        if (!user) {
            return next(new Error('business not found'));
        }

        if (user?.status === 'suspended') return next(new Error('account has been deactivated. contact support'));

        

        if (user?.changedPasswordAfter(decoded.iat)) return next(new Error('password changed recently'));
        req.user = user
        next();
    } catch (err: any) {
        return next(new Error(err.message));
    }
}

const RestrictTo = (...roles: string[]) => (req: AppRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
        return next(new Error('unauthorized'));
    }
    next();
}

const AdminOnly = RestrictTo(ROLES.ADMIN, ROLES.SUPERADMIN);
const SuperAdminOnly = RestrictTo(ROLES.SUPERADMIN);
const InventoryOnly = RestrictTo(ROLES.INVENTORY, ROLES.ADMIN);
const AccountantOnly = RestrictTo(ROLES.ACCOUNTANT, ROLES.ADMIN);

module.exports = {Protect, AdminOnly, SuperAdminOnly, InventoryOnly, AccountantOnly}