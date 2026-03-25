import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL!);
    connection.isConnected = db.connection.readyState;
    console.log(`Database connected successfully :)`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
