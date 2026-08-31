import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: "",
    },
    preferredDate: {
        type: Date,
        required: true,
    },
    enquiryDate: {
        type: Date,
        default: Date.now,
    },
    preferredTreatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
        required: true,
    }
}, { timestamps: true });

export const EnquiryModel =
    mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);