import { getModelForClass, prop } from "@typegoose/typegoose";
import { dbConnect } from "../mongoose";

export class Boardgame {
  @prop({ required: true })
  name!: string;

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

export const BoardgameModel = getModelForClass(Boardgame, {
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
  
export async function getBoardgames(): Promise<BoardgameEntity[]> {
  await dbConnect();
  const boardgames = await BoardgameModel.find().sort({ name: 1 });
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