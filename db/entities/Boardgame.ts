import { ObjectId } from "mongodb";
import { getCollection } from "../client";

export interface Boardgame {
  _id: ObjectId
  name: string
  minPlayers?: number
  maxPlayers?: number
  minPlayTime?: number
  maxPlayTime?: number
  publisher?: string
  yearPublished?: number
}

export const boardgames = await getCollection<Boardgame>('boardgame');