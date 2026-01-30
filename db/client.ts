import "reflect-metadata";
import mongoose from "mongoose";
import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const MONGODB_URI = process.env.MONGODB_URI;

function getDbName() {
    const prefix = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
    return `${prefix}_next_web`;
}

const dbName = getDbName();

// Build the full connection URI with database name
function getConnectionUri(): string {
    const uri = new URL(MONGODB_URI);
    uri.pathname = `/${dbName}`;
    return uri.toString();
}

// ============================================================
// Mongoose connection for Typegoose models
// ============================================================

// Cache the mongoose connection to avoid multiple connections in serverless environments
let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cachedConnection) {
        return cachedConnection;
    }

    const connectionUri = getConnectionUri();
    
    cachedConnection = await mongoose.connect(connectionUri);
    
    return cachedConnection;
}

// Get the mongoose connection
export function getMongooseConnection() {
    return mongoose.connection;
}

// ============================================================
// Native MongoDB client for better-auth compatibility
// ============================================================

// Using native MongoClient for better-auth since it expects a synchronous Db object
const nativeClient = new MongoClient(MONGODB_URI);

// For backward compatibility with better-auth which uses mongodb adapter
export function getDb(): Db {
    return nativeClient.db(dbName);
}

export function getMongoClient(): MongoClient {
    return nativeClient;
}