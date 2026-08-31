import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.DB_URI!, {
    dbName: "ganga_dental_clinic",
  });
}
