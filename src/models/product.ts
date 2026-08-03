import { timeStamp } from "node:console"
const {skuGenerator, getProductStatus} = require('../utils/products')

const mongoose = require('mongoose')
const {PRODUCT_STATUS} = require('../config/constants')

const ProductSchema = new mongoose.Schema({
    sku: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    unitCost: {
        type: Number,
        min: 0
    },
    unitPrice: {
        type: Number,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        default: 'Stock In'
    },
    status: {
        type: String,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.OUT_OF_STOCK
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true,})

    ProductSchema.pre('save', async function (this: any) {
        if(this.isNew) {    
            this.sku = await skuGenerator();
         
        }
    })

    ProductSchema.pre('save', async function (this: any) {
        if(this.isNew) {
            this.status = await getProductStatus(this.quantity);
        }
    })


module.exports = mongoose.model('Product', ProductSchema)