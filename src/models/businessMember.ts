const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const BusinessMemberSchema = new mongoose.Schema({
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
     
    lastLogin: {
        type: Date
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

BusinessMemberSchema.pre('save', async function (this: any) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
})

   BusinessMemberSchema.methods.comparePassword = async function (business: string) {
    return bcrypt.compare(business, this.password)
} 

BusinessMemberSchema.methods.changedPasswordAfter =  function (jwtTimestamp: number): boolean {
    if(this.passwordChangedAt) return parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10) > jwtTimestamp
    return false
} 


module.exports = mongoose.model('BusinessMember', BusinessMemberSchema)