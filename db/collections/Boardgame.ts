import { prop, getModelForClass, modelOptions, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { connectToDatabase } from "../client";

@modelOptions({ schemaOptions: { collection: "boardgame", timestamps: false } })
class Boardgame {
    @prop({ required: true })
    public name!: string;

    @prop()
    public minPlayers?: number;

    @prop()
    public maxPlayers?: number;

    @prop()
    public minPlayTime?: number;

    @prop()
    public maxPlayTime?: number;

    @prop()
    public publisher?: string;

    @prop()
    public yearPublished?: number;

    @prop()
    public addedBy?: string;

    @prop()
    public addedAt?: Date;

    @prop()
    public updatedBy?: string;

    @prop()
    public updatedAt?: Date;
}

export interface BoardgameDoc {
    _id: Types.ObjectId;
    name: string;
    minPlayers?: number;
    maxPlayers?: number;
    minPlayTime?: number;
    maxPlayTime?: number;
    publisher?: string;
    yearPublished?: number;
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    id?: undefined;
}

export interface BoardgameEntity {
    id?: string;
    name: string;
    minPlayers?: number;
    maxPlayers?: number;
    minPlayTime?: number;
    maxPlayTime?: number;
    publisher?: string;
    yearPublished?: number;
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    _id?: undefined;
}

interface BoardgameInput {
    name: string;
    minPlayers?: number;
    maxPlayers?: number;
    minPlayTime?: number;
    maxPlayTime?: number;
    publisher?: string;
    yearPublished?: number;
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

function toBoardgameEntity(doc: BoardgameDoc): BoardgameEntity {
    return {
        id: doc._id.toString(),
        name: doc.name,
        minPlayers: doc.minPlayers,
        maxPlayers: doc.maxPlayers,
        minPlayTime: doc.minPlayTime,
        maxPlayTime: doc.maxPlayTime,
        publisher: doc.publisher,
        yearPublished: doc.yearPublished,
        addedBy: doc.addedBy,
        addedAt: doc.addedAt,
        updatedBy: doc.updatedBy,
        updatedAt: doc.updatedAt,
        _id: undefined,
    };
}

export function fromFormData(formData: FormData): BoardgameInput {
    const name = formData.get('name')?.toString() || '';
    const minPlayers = formData.get('players_min') ? parseInt(formData.get('players_min')!.toString(), 10) : undefined;
    const maxPlayers = formData.get('players_max') ? parseInt(formData.get('players_max')!.toString(), 10) : undefined;
    const minPlayTime = formData.get('playtime_min') ? parseInt(formData.get('playtime_min')!.toString(), 10) : undefined;
    const maxPlayTime = formData.get('playtime_max') ? parseInt(formData.get('playtime_max')!.toString(), 10) : undefined;
    const publisher = formData.get('publisher')?.toString() || undefined;
    const yearPublished = formData.get('year_published') ? parseInt(formData.get('year_published')!.toString(), 10) : undefined;

    if (!name) {
        throw new Error('Name is required');
    }

    return {
        name,
        minPlayers,
        maxPlayers,
        minPlayTime,
        maxPlayTime,
        publisher,
        yearPublished,
    };
}

const BoardgameModel = getModelForClass(Boardgame);

async function getBoardgameModel(): Promise<ReturnModelType<typeof Boardgame>> {
    await connectToDatabase();
    return BoardgameModel;
}

export async function boardgameCollection() {
    return await getBoardgameModel();
}

export async function getBoardgames(): Promise<BoardgameEntity[]> {
    const model = await getBoardgameModel();
    const boardgames = await model.find({}).sort({ name: 1 }).lean();
    return boardgames.map((bg) => toBoardgameEntity(bg as BoardgameDoc));
}

export async function insertBoardgame(boardgame: BoardgameInput) {
    const model = await getBoardgameModel();
    return await model.create(boardgame);
}

export async function updateBoardgame(id: string, updates: Partial<BoardgameInput>) {
    const model = await getBoardgameModel();
    return await model.updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: updates }
    );
}

export async function deleteBoardgame(id: string) {
    const model = await getBoardgameModel();
    return await model.deleteOne({ _id: new Types.ObjectId(id) });
}