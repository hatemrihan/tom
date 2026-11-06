import { MongoClient, type Db } from "mongodb";

/**
 * Lazily-created, globally cached MongoDB client.
 *
 * - Never throws at import time (so `next build` works without env vars).
 * - Reuses one connection across hot reloads in dev and across invocations
 *   of a warm serverless function in production.
 */

const globalForMongo = globalThis as unknown as {
  __mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(
      new Error('Missing environment variable: "MONGODB_URI"')
    );
  }

  if (!globalForMongo.__mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
      family: 4,
    });
    globalForMongo.__mongoClientPromise = client.connect().catch((error) => {
      // Allow the next request to retry instead of caching a failed promise.
      globalForMongo.__mongoClientPromise = undefined;
      throw error;
    });
  }

  return globalForMongo.__mongoClientPromise;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  const client = await getClientPromise();
  const db = client.db(process.env.MONGODB_DB || "tom_portfolio");
  return { client, db };
}
