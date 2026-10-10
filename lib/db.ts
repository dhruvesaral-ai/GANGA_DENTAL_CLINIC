import dns from "dns";
import mongoose from "mongoose";

// Node on Windows often fails SRV lookups via the local router DNS (querySrv ECONNREFUSED).
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
    global.mongooseConn = mongoose.connect(uri).catch((err) => {
      global.mongooseConn = undefined;
      throw err;
    });
  }

  await global.mongooseConn;
  return mongoose.connection;
}
