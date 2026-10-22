import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    imageUrl: {
        type: String,
        default: null,
    },
}, { timestamps: true });

export const TreatmentModel =
  mongoose.models.Treatment || mongoose.model("Treatment", treatmentSchema);