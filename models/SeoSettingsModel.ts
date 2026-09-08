import mongoose from "mongoose";

const seoSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const SeoSettingsModel =
  mongoose.models.SeoSettings || mongoose.model("SeoSettings", seoSettingsSchema);
