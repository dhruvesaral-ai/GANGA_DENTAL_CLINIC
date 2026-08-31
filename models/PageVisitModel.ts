import mongoose from "mongoose";

const pageVisitSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const PageVisitModel =
  mongoose.models.PageVisit || mongoose.model("PageVisit", pageVisitSchema);
