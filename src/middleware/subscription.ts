import { NextFunction, Response } from "express";
const User = require('../models/User');
import { AppRequest } from "../utils/request";

const CheckSubscription = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.subscriptionStatus) throw new Error('please subscribe to a plan to use this feature');

        next()
    } catch (err: any) {
        next(err)
    }
}

const checkSubscriptionPlan = (...plans: string[]) => (req: AppRequest, res: Response, next: NextFunction) => {

        const user = req.user;
        if (!plans.includes(user.subscriptionPlan)) throw new Error('please subscribe to a plan to use this feature');
        next()
    
}

const basicPlan = checkSubscriptionPlan('basic')
const premiumPlan = checkSubscriptionPlan('premium')

module.exports = {CheckSubscription, basicPlan, premiumPlan}