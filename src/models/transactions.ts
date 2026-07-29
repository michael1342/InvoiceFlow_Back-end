const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    transactionReference: {
        type: String,
        required: true
    },
    transactionId: {
        type: String
    },

    email: {
        type: String,
       required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true,
        default: 'NGN',
        sparse: true
    },

    status: {
        type: String,
        default: 'pending'
    },

    transactionDate: {
        type: Date,
        default: Date.now
    },

    service: {
        type: String,
        default: 'subscription'
    },

    subscriptionPlan: {
        type: String,
        required: true
    },

    paidAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);