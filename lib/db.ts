import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  const uri = process.env.DB_URI;

  if (!uri) {
    throw new Error("DB_URI is not set in environment variables");
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!global.mongooseConn) {
    global.mongooseConn = mongoose.connect(uri);
  }

  await global.mongooseConn;
  return mongoose.connection;
}
