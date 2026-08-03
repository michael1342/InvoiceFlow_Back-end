const Products = require('../models/product')
import { NextFunction, Response } from "express";
import { Product } from '../interfaces'
import { AppRequest } from "../utils/request";
const { getProductStatus } = require('../utils/products')

class Inventory {
    async addProduct(req: AppRequest, data: any): Promise<void> {

        const { name, category, unitCost, unitPrice, quantity }: Product = data
        const businessId = req.user.id
        const exists = await Products.findOne({ sku: req.body.sku })

        if (exists) {
            throw new Error('Product already exists')
        }

        const product = await Products.create({ name, category, unitCost, unitPrice, quantity, businessId })

        return product
    }

    async findAllProducts(req: AppRequest): Promise<void> {
        const products = await Products.find({ businessId: req.user.id })

        if(!products) throw new Error('no products found')

        return products
    }

    async findProductById(req: AppRequest): Promise<void> {
        const product = await Products.findById({ businessId: req.user.id, _id: req.params.id })

        if(!product) throw new Error('product not found')

        return product
    }

    async updateProduct(req: AppRequest, data: any): Promise<void> {
        const product = await Products.findOneAndUpdate({ businessId: req.user.id, _id: req.params.id }, data, { new: true })

        if(data.quantity) {
            product.status = getProductStatus(data.quantity)
        }

        if(!product) throw new Error('product not found')
        return product
    }

    async deleteProduct(req: AppRequest): Promise<void> {
        const product = await Products.findOneAndDelete({ businessId: req.user.id, _id: req.params.id })

        if(!product) throw new Error('product not found')
        return product
    }
}

module.exports = new Inventory()