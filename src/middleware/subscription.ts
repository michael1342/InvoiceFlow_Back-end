import { NextFunction, Response } from "express";
const User = require('../models/User');

const CheckSubscription = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.subscriptionStatus) throw new Error('please subscribe to a plan to use this feature');

        next()
    } catch (err: any) {
        next(err)
    }
}

module.exports = {CheckSubscription}