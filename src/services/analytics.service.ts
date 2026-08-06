import { start } from "node:repl";
import { AppRequest } from "../utils/request";
const mongoose = require('mongoose')

const Products = require("../models/product");

class ChartData {
    #today
    #startOfWeek
    #endOfWeek
    #startOfMonth
    #endOfMonth
    #startOfYear
    #endOfYear

    constructor() {
        // this.labels = []
        // this.data = []
        this.#today = new Date()
        this.#startOfWeek = new Date(this.#today)
        this.#startOfWeek.setDate(this.#today.getDate() - this.#today.getDay() + 1) // Monday
        this.#startOfWeek.setHours(0, 0, 0, 0)

        this.#endOfWeek = new Date(this.#startOfWeek)
        this.#endOfWeek.setDate(this.#startOfWeek.getDate() + 7)

        this.#startOfMonth = new Date(this.#today.getFullYear(), this.#today.getMonth(), 1)
        this.#endOfMonth = new Date(this.#today.getFullYear(), this.#today.getMonth() + 1, 0)

        this.#startOfYear = new Date(this.#today.getFullYear(), 0, 1)
        this.#endOfYear = new Date(this.#today.getFullYear(), 11, 31) 
    }
    
    async InventoryChart(req: AppRequest) {

       const stockMovement = await Products.aggregate([
       {
        $match: {
           businessId: new mongoose.Types.ObjectId(req.user.id),
            createdAt: {
                $gte: this.#startOfWeek,
                $lt: this.#endOfWeek
            }
        }
    },
    {
        $group: {
            _id: {
                day: {
                    $dayOfWeek: "$createdAt"
                },
                type: "$type"
            },
            total: {
                $sum: "$quantity"
            }
        }
    }
       ])

        return stockMovement
    }
}

module.exports = new ChartData()