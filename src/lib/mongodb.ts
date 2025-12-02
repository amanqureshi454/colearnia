// lib/mongodb.ts
import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI!;
const options: MongoClientOptions = {};

declare global {
  // Prevent multiple connections in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise || client.connect();

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(); // Uses DB name from URI
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}

export { clientPromise };
