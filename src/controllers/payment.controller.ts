const PaymentService = require('../services/payment.service')
const Transaction = require('../models/transactions')
const User = require('../models/User')
const Business = require('../models/business')
import { NextFunction, Response } from "express";
import { AppRequest } from "../utils/request";
require('dotenv').config()

exports.initiatePayment = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Business.findById(req.user._id);
        const response = await PaymentService.initializeTransaction(user.email, req.body.amount, user.firstName, (user.phone || req.body.phone));

        const reference = await response.data.reference;
        const emails = user.email
        const amount = req.body.amount
        await Transaction.create({
            user: req.user._id,
            transactionReference: reference,
            amount: amount,
            status: 'pending',
            email: emails,
            subscriptionPlan: req.body.subscriptionPlan
        });
        res.status(200).json(response);
    } catch (err: any) {
        next(err)
    }
}

exports.createTransaction = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await Business.findById(req.user.id)
        const paystackData = req.paystackTransaction
        const transactionReference = paystackData.data.reference

        const transaction = await Transaction.findOne({ transactionReference })
        const superAdmin = await User.findById(process.env.SUPER_ADMIN_ID)


        if (!transaction) return res.status(400).json({ message: "transaction not found" })

        if (transaction.status === 'success') return res.status(400).json({ message: "Transaction has already been processed" })

        const response = await Transaction.updateOne(
            { _id: transaction._id },
            {
                $set: {
                    type: paystackData.data.type,
                    status: paystackData.data.status,
                    currency: paystackData.data.currency,
                    paidAt: paystackData.data.paidAt,
                    createdAt: paystackData.data.createdAt,
                    paymentMethod: paystackData.data.channel,
                    fee: paystackData.data.fees / 100
                }
            }
        );
        if (paystackData.data.status === "success") {
            user.subscriptionStatus = true
            superAdmin.wallet.balance += transaction.amount

            user.subscriptionPlan = transaction.subscriptionPlan

            await user.save();
            await superAdmin.save()
            await transaction.save()

        }

        res.status(200).json(response)

    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to create transaction', message: error.message });
    }
};