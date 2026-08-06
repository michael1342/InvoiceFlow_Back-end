const InventoryService = require('../services/inventory.service');
const analyticsService = require('../services/analytics.service');
import { NextFunction, Response } from "express";
import { AppRequest } from "../utils/request";

exports.addProduct = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const product = await InventoryService.addProduct(req, req.body)
        res.status(200).json({ product }); 
    } catch (err) {
        next(err)
    }
}

exports.getProducts = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const products = await InventoryService.findAllProducts(req)
        res.status(200).json({ products });
    } catch (err) {
        next(err)
    }
}

exports.getProductById = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const product = await InventoryService.findProductById(req)
        res.status(200).json({ product });
    } catch (err) {
        next(err)
    }
}

exports.updateProduct = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const product = await InventoryService.updateProduct(req, req.body)
        res.status(200).json({ product });
    } catch (err) {
        next(err)
    }
}

exports.deleteProduct = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const product = await InventoryService.deleteProduct(req)
        res.status(200).json({ product });
    } catch (err) {
        next(err)
    }
}

exports.getChartData = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const chartData = await analyticsService.InventoryChart(req)
        res.status(200).json({ chartData });
    } catch (err) {
        next(err)
    }
}

