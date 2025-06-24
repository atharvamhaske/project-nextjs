import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongouri in .env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const opts = {
    //for production level plans
    bufferCommands: true,
    maxPoolSize: 10,
  };

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    mongoose
    .connect(MONGODB_URI)
    .then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Error connecting to database");
  }
  return cached.conn;
}
