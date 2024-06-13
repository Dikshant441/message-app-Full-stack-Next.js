import mongoose from "mongoose";

type ConnectObject = {
  isConnected?: number;
};

const connection: ConnectObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("already connected to database");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGO_URI || '', {});

    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected sucesfully");

    // just for check what we g
    console.groupCollapsed(db.connection);
    console.log(connection);
  } catch (error) {
    console.error("Database connection failed:", error);
    // exit in case of connextion error
    process.exit(1);
  }
}
export default dbConnect;
