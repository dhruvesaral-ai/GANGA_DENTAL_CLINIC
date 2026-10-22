import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    img_url: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["home-carousal", "gallery"],
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const GalleryModel =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
