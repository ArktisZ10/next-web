import { ObjectId } from "mongodb";
import { getCollection } from "../client";
import bcrypt from "bcryptjs";

interface User {
  username: string;
  password: string;
  createdAt?: Date;
}

export interface UserDoc extends User {
  _id: ObjectId;
}

export async function userCollection() {
  return await getCollection<UserDoc>("users");
}

export async function getUserByUsername(username: string): Promise<UserDoc | null> {
  const collection = await userCollection();
  return await collection.findOne({ username });
}

export async function createUser(username: string, password: string): Promise<UserDoc> {
  const collection = await userCollection();
  
  // Check if user already exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    username,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(user as UserDoc);
  return { ...user, _id: result.insertedId } as UserDoc;
}

export async function verifyPassword(user: UserDoc, password: string): Promise<boolean> {
  return await bcrypt.compare(password, user.password);
}
