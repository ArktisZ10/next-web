import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { dbConnect } from "../mongoose";
import { z } from "zod";

export class Boardgame {
  @prop({ required: true })
  name!: string;

  @prop()
  image?: string;

  @prop()
  minPlayers?: number;

  @prop()
  maxPlayers?: number;

  @prop()
  minPlayTime?: number;

  @prop()
  maxPlayTime?: number;

  @prop()
  publisher?: string;

  @prop()
  yearPublished?: number;

  @prop()
  addedBy?: string;

  @prop()
  addedAt?: Date;

  @prop()
  updatedBy?: string;

  @prop()
  updatedAt?: Date;
}

/**
 * Zod schema for AI data extraction and validation.
 * Strictly typed against the Typegoose `Boardgame` class to ensure the schema
 * always stays in sync with the database model.
 */
export const boardgameSchema: z.ZodType<Partial<Boardgame>> = z.object({
  name: z.string().optional().describe('The name of the board game'),
  image: z.string().optional().describe('A valid url to an image of the board game'),
  minPlayers: z.number().optional().describe('The minimum number of players'),
  maxPlayers: z.number().optional().describe('The maximum number of players'),
  minPlayTime: z.number().optional().describe('The minimum playtime in minutes'),
  maxPlayTime: z.number().optional().describe('The maximum playtime in minutes'),
  publisher: z.string().optional().describe('The publisher of the board game'),
  yearPublished: z.number().optional().describe('The year the board game was published'),
});

export const BoardgameModel = mongoose.models.Boardgame || getModelForClass(Boardgame, {
  schemaOptions: { collection: 'boardgame' }
});

export interface BoardgameEntity extends Boardgame {
  id: string;
}

import { DocumentType } from "@typegoose/typegoose";

function toBoardgameEntity(doc: DocumentType<Boardgame>): BoardgameEntity {
  const obj = doc.toJSON() as unknown as { _id: unknown } & Record<string, unknown>;
  const { _id, ...rest } = obj;
  return {
    ...(rest as unknown as Boardgame),
    id: String(_id),
  };
}

export function fromFormData(formData: FormData): Boardgame {
  const name = formData.get('name')?.toString() || '';
  const image = formData.get('image')?.toString();
  const minPlayersStr = formData.get('minPlayers') || formData.get('players_min');
  const maxPlayersStr = formData.get('maxPlayers') || formData.get('players_max');
  const minPlayTimeStr = formData.get('minPlayTime') || formData.get('playtime_min');
  const maxPlayTimeStr = formData.get('maxPlayTime') || formData.get('playtime_max');
  const _yearStr = formData.get('yearPublished') || formData.get('year_published');

  const minPlayers = minPlayersStr ? parseInt(minPlayersStr.toString(), 10) : undefined;
  const maxPlayers = maxPlayersStr ? parseInt(maxPlayersStr.toString(), 10) : undefined;
  const minPlayTime = minPlayTimeStr ? parseInt(minPlayTimeStr.toString(), 10) : undefined;
  const maxPlayTime = maxPlayTimeStr ? parseInt(maxPlayTimeStr.toString(), 10) : undefined;
  const publisher = formData.get('publisher')?.toString();
  const yearPublished = _yearStr ? parseInt(_yearStr.toString(), 10) : undefined;

  if (!name) {
    throw new Error('Name is required');
  }

  return {
    name,
    image,
    minPlayers,
    maxPlayers,
    minPlayTime,
    maxPlayTime,
    publisher,
    yearPublished,
  };
}
  
export interface BoardgameFilter {
  search?: string;
  players?: number;
  playtime?: number;
}

export async function getBoardgames(filter?: BoardgameFilter): Promise<BoardgameEntity[]> {
  await dbConnect();
  
  const query: mongoose.QueryFilter<Boardgame> = {};
  
  if (filter?.search) {
    query.name = { $regex: filter.search, $options: 'i' };
  }

  if (filter?.players !== undefined) {
    query.$and = query.$and || [];
    query.$and.push(
      { $or: [{ minPlayers: { $lte: filter.players } }, { minPlayers: null }, { minPlayers: { $exists: false } }] },
      { $or: [{ maxPlayers: { $gte: filter.players } }, { maxPlayers: null }, { maxPlayers: { $exists: false } }] }
    );
  }

  if (filter?.playtime !== undefined) {
    query.$and = query.$and || [];
    query.$and.push(
      { $or: [{ minPlayTime: { $lte: filter.playtime } }, { minPlayTime: null }, { minPlayTime: { $exists: false } }] },
      { $or: [{ maxPlayTime: { $gte: filter.playtime } }, { maxPlayTime: null }, { maxPlayTime: { $exists: false } }] }
    );
  }
  
  const boardgames = await BoardgameModel.find(query).sort({ name: 1 });
  return boardgames.map(toBoardgameEntity);
}

export async function insertBoardgame(boardgame: Partial<Boardgame>) {
  await dbConnect();
  return await BoardgameModel.create(boardgame);
}

export async function updateBoardgame(id: string, updates: Partial<Boardgame>) {
  await dbConnect();
  return await BoardgameModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
}

export async function deleteBoardgame(id: string) {
  await dbConnect();
  return await BoardgameModel.findByIdAndDelete(id);
}