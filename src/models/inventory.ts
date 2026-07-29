const mongoose = require('mongoose')
const {PRODUCT_STATUS} = require('../config/constants')

const InventorySchema = new mongoose.Schema({
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.IN_STOCK
    }
})