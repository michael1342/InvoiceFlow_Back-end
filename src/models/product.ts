import { timeStamp } from "node:console"

const mongoose = require('mongoose')
const {PRODUCT_STATUS} = require('../config/constants')

const ProductSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    businessID: {
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Business',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    unitCost: {
        type: Number,
    },
    unitPrice: {
        type: Number
    },
    quantity: {
        type: Number
    },
    status: {
        type: String,
        enum: PRODUCT_STATUS
    },
    addedDate: Date
    
}, {timestamp: true,})



module.exports = mongoose.model('Product', ProductSchema)