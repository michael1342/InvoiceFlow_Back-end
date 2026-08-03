import mongoose from 'mongoose';
import { CURRENCIES } from '../constants/currencies';
import { STATUS } from '../constants/invoiceStatus';

const itemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    }, sku: {
        type: String,
        required: true,
        trim:true
    },
    productName: {
        type: String,
        required: true,
        trim:true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    lineTotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'customer', required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "businesses",
        required: true,
    },
    invoiceNumber: {
        type: String, required: true,trim:true
    },
    invoiceDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: { type: Date, required: true },
    items: {
        type: [
            itemSchema
        ],required:true,
        validate: {
            validator: (items: unknown[]) => items.length > 0,
            message: "Invoice must contain at least one item.",
        },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: STATUS,
        default: "Draft"
    },
    currency: {
        type: String,
        enum:CURRENCIES,
        default: "NGN",
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
        min: 0,
    },
    discount: { type: Number, default: 0, required: true, min: 0 },
    notes: { type: String ,trim:true},
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    issuedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    issuedAt:{type:Date, default:Date.now}
}, { timestamps: true });

invoiceSchema.index(
    { business: 1, invoiceNumber: 1 },
    { unique: true }
);
export default mongoose.model("Invoice", invoiceSchema);