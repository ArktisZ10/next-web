import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../client";


interface Boardgame {
  name: string
  minPlayers?: number
  maxPlayers?: number
  minPlayTime?: number
  maxPlayTime?: number
  publisher?: string
  yearPublished?: number
}

export interface BoardgameDoc extends Boardgame {
  _id: ObjectId
  id?: undefined
}

export interface BoardgameEntity extends Boardgame {
  _id?: undefined
  id?: string
}

function toBoardgameEntity(doc: BoardgameDoc): BoardgameEntity {
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined,
  };
}

function fromBoardgameEntity(entity: BoardgameEntity): BoardgameDoc {
  return {
    ...entity,
    _id: new ObjectId(entity.id),
    id: undefined,
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
  
export async function boardgameCollection() {
  return await getCollection<BoardgameDoc>("boardgame");
}

export async function getBoardgames(): Promise<BoardgameEntity[]> {
  const collection = await boardgameCollection();
  const boardgames = await collection.find({}, { sort: { name: 1 } }).toArray();
  return boardgames.map(toBoardgameEntity);
}

export async function insertBoardgame(boardgame: BoardgameEntity) {
  const collection = await boardgameCollection();
  return await collection.insertOne(fromBoardgameEntity(boardgame));
}

export async function updateBoardgame(boardgame: BoardgameEntity) {
  const collection = await boardgameCollection();
  const { _id, id, ...updateFields } = fromBoardgameEntity(boardgame);
  return await collection.updateOne(
    { _id: new ObjectId(boardgame.id) },
    { $set: updateFields }
  );
}

export async function deleteBoardgame(id: string) {
  const collection = await boardgameCollection();
  return await collection.deleteOne({ _id: new ObjectId(id) });
}