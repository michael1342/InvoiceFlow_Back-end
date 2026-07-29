// import { Number } from "mongoose";

import { subscribe } from "node:diagnostics_channel";

const mongoose = require("mongoose");
const { ROLES } = require("../constants/roles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BusinessProfile = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    sparse: true
  },
  businessAddress: {
    type: String,
    required: true,
    sparse: true
  },
  businessEmail: {
    type: String,
  },
  businessPhone: {
    type: String,
    required: true,
    sparse: true
  },
  businessRegistrationNumber: {
    type: String,
    required: true,
    sparse: true
  }
})

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
      default: ROLES.ADMIN,
    },

    wallet: {
      balance: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'NGN'
      },
        walletStatus: {
            type: String,
            default: "active",
            enum: ["active", "inactive"]
        }
    },

   transactions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
   },

    businessProfile: {
        type: [BusinessProfile]
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'banned'],
        default: 'active'
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

    subscribedAt: {
        type: Date
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
  },{timestamps: true,});

 UserSchema.pre('save', async function(this: any): Promise<void> {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password)
} 

UserSchema.methods.changedPasswordAfter = function (jwtTimestamp: number) {
    if(this.passwordChangedAt) {
        return parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10) > jwtTimestamp
    }
} 

UserSchema.set('toJSON', {
    transform: (_: any, ret: any) => {delete ret.password; return ret;},
})

module.exports = mongoose.model('User', UserSchema);