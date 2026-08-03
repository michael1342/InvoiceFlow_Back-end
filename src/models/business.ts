import mongoose from 'mongoose';
import { COUNTRIES } from '../constants/countries';
import { CURRENCIES } from '../constants/currencies';
import bcrypt from 'bcryptjs';
import { HydratedDocument, InferSchemaType } from "mongoose";
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: {
        type: String,
        enum: COUNTRIES,
        default: "Nigeria",
    },
}, { _id: false });
const ownerSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },

    role: {
        type: String,
        required: true,
        enum: ['director', 'shareholder', 'proprietor', 'partner', 'trustee'],
    },

    idType: {
        type: String,
        required: true,
        enum: ['national_id', 'international_passport', 'drivers_license', 'voters_card'],
    },
    idNumber: { type: String, required: true, trim: true },
    idDocumentUrl: { type: String, required: true },

    passportPhotoUrl: { type: String, required: true },

    address: {
        type: addressSchema,
        required: true
    },
    phoneNumber: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"]},

}, { _id: false });
const businessSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: [true, "Email is required"], lowercase: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"], trim: true },
    password: { type: String, required: [true, "Password is required"] ,minlength:8},
    contactNumber: { type: String, match: [/^(\+234|0)[789][01]\d{8}$/, "invalid phone number"], required: [true, "Phone number is required"] },
    rcNumber: { type: String },
    industry
        : { type: String, required: true, trim: true },
    address: [addressSchema],
    proofOfAddressUrl: { type: String, required: true },
    owners: {
        type: [ownerSchema],
        required: true,
        validate: {
            validator: function (owners:any) {
                return Array.isArray(owners) && owners.length > 0;
            },
            message: "At least one owner is required"
        }
    },
    defaultCurrency: {
    type:String,
    enum:CURRENCIES,
    required:true,
    default:"NGN"
},
    isVerified: { type: Boolean, default: false },
    profileUpdatedAt: Date,
}, { timestamps: true })

type Business = InferSchemaType<typeof businessSchema>;
// virtual
businessSchema.pre(
    "save",
    async function (this: HydratedDocument<Business>) {
        if (!this.isModified("password")) return;

        this.password = await bcrypt.hash(this.password, 12);
    }
);
businessSchema.methods.comparePassword = async function (
    this: HydratedDocument<Business>,
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};
// indexing.....
businessSchema.index({ email: 1 });
businessSchema.index(
    { rcNumber: 1 }, { unique: true, sparse: true }

);
businessSchema.index({ 'owners.idNumber': 1 });
export default mongoose.model("Business", businessSchema);