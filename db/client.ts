import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
import { type Document } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(process.env.MONGODB_URI);
attachDatabasePool(client);

export function getDb() {
    const prefix = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
    const dbName = `${prefix}_next_web`;
    return client.db(dbName);
}

export async function getCollection<T extends Document>(name: string) {
    const db = getDb();
    return db.collection<T>(name);
}

export function getMongoClient() {
    return client;
}