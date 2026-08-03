const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        default: 'admin'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subscriptionDuration: {
        type: Number,
        default: 30
    },
    subscriptionStatus: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
      isVerified: {
        type: Boolean,
        default: false
    },
    
    lastLogin: {
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},{timestamps: true}, {_id: false})


 BusinessSchema.pre('save', async function(this: any): Promise<void> {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12)
})


BusinessSchema.methods.comparePassword = async function (business: string) {
    return bcrypt.compare(business, this.password)
} 

BusinessSchema.methods.changedPasswordAfter = function (jwtTimestamp: number) {
    if(this.passwordChangedAt) {
        return parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10) > jwtTimestamp
    }
} 

BusinessSchema.set('toJSON', {
    transform: (_: any, ret: any) => {delete ret.password; return ret;},
})


module.exports = mongoose.model('Business', BusinessSchema)