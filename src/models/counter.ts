import mongoose from "mongoose";
const counterSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "businesses",
        unique: true,
        required: true,
    },
    invoiceSequence: {
        type: Number,
        default: 0,
    },
},{ timestamps: true });
export default mongoose.model("Counter", counterSchema);