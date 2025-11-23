import { MongoClient, Db } from "mongodb";

// Lazy client variables (no top-level connection)
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!uri) {
  // Do NOT throw during build — only warn
  console.warn(
    "⚠️ MongoDB URI is not set (this is normal during Cloud Run build)"
  );
}

async function getClient(): Promise<MongoClient> {
  if (client) return client;

  if (!clientPromise) {
    clientPromise = new MongoClient(uri || "").connect();
  }

  client = await clientPromise;
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(); // database name comes from URI
}
