const Product = require('../models/product')
import { NextFunction, Response } from "express";

class Inventory {

    async retriveAllProducts(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await Product.findById(businessid)
            res.status(200).json({ products });
        } catch (err) {
            next(err)
        }
    }
}