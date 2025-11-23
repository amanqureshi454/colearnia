export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI!;
const options: MongoClientOptions = {};

declare global {
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
    return client.db();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}

export { clientPromise };
