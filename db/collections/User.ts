import { prop, getModelForClass, modelOptions, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { connectToDatabase } from "../client";
import bcrypt from "bcryptjs";

@modelOptions({ schemaOptions: { collection: "users", timestamps: false } })
class User {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ default: () => new Date() })
    public createdAt?: Date;
}

export interface UserDoc {
    _id: Types.ObjectId;
    username: string;
    password: string;
    createdAt?: Date;
}

const UserModel = getModelForClass(User);

async function getUserModel(): Promise<ReturnModelType<typeof User>> {
    await connectToDatabase();
    return UserModel;
}

export async function userCollection() {
    return await getUserModel();
}

export async function getUserByUsername(username: string): Promise<UserDoc | null> {
    const model = await getUserModel();
    const user = await model.findOne({ username }).lean();
    return user as UserDoc | null;
}

export async function createUser(username: string, password: string): Promise<UserDoc> {
    const model = await getUserModel();
    
    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await model.create({
        username,
        password: hashedPassword,
        createdAt: new Date(),
    });

    return {
        _id: user._id,
        username: user.username,
        password: user.password,
        createdAt: user.createdAt,
    };
}

export async function verifyPassword(user: UserDoc, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
}
