import { Request, Response, NextFunction } from "express";
require('dotenv').config()

const verify = async(req: any, res: Response, next: NextFunction) => {
    try {
        const {reference} = req.params
        const url = `https://api.paystack.co/transaction/verify/${reference}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to verify transaction');
        }
        req.paystackTransaction = responseData
        next()
    } catch (err: any) {
        next(err)
    }
}

module.exports = {verify}