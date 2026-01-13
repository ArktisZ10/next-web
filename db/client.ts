import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
import { type Document } from "mongodb";
import { type Boardgame } from "./entities/Boardgame";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(process.env.MONGODB_URI);
attachDatabasePool(client);

function database() {
    const prefix = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
    const dbName = `${prefix}_next_web`;
    return client.db(dbName);
}

export async function getCollection<T extends Document>(name: string) {
    const db = database();
    return db.collection<T>(name);
}