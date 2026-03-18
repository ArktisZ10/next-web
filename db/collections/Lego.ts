import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { dbConnect } from "../mongoose";

export class Lego {
  @prop({ required: true })
  name!: string;

  @prop()
  setNumber?: string;

  @prop()
  theme?: string;

  @prop()
  pieceCount?: number;

  @prop()
  minifigures?: number;

  @prop()
  yearReleased?: number;

  @prop()
  image?: string;

  @prop()
  addedBy?: string;

  @prop()
  addedAt?: Date;

  @prop()
  updatedBy?: string;

  @prop()
  updatedAt?: Date;
}

export const LegoModel = mongoose.models.Lego || getModelForClass(Lego, {
  schemaOptions: { collection: 'lego' }
});

export interface LegoEntity extends Lego {
  id: string;
}

import { DocumentType } from "@typegoose/typegoose";

function toLegoEntity(doc: DocumentType<Lego>): LegoEntity {
  const obj = doc.toJSON() as unknown as { _id: unknown } & Record<string, unknown>;
  const { _id, ...rest } = obj;
  return {
    ...(rest as unknown as Lego),
    id: String(_id),
  };
}

export function fromFormData(formData: FormData): Lego {
  const name = formData.get('name')?.toString() || '';
  const setNumber = formData.get('setNumber')?.toString();
  const theme = formData.get('theme')?.toString();
  const pieceCount = formData.get('pieceCount') ? parseInt(formData.get('pieceCount')!.toString(), 10) : undefined;
  const minifigures = formData.get('minifigures') ? parseInt(formData.get('minifigures')!.toString(), 10) : undefined;
  const yearReleased = formData.get('yearReleased') ? parseInt(formData.get('yearReleased')!.toString(), 10) : undefined;
  const image = formData.get('image')?.toString();

  if (!name) {
    throw new Error('Name is required');
  }

  return {
    name,
    setNumber,
    theme,
    pieceCount,
    minifigures,
    yearReleased,
    image,
  };
}
  
export interface LegoFilter {
  search?: string;
  theme?: string;
}

export async function getLegos(filter?: LegoFilter): Promise<LegoEntity[]> {
  await dbConnect();
  
  const query: mongoose.QueryFilter<Lego> = {};
  
  if (filter?.search) {
    query.name = { $regex: filter.search, $options: 'i' };
  }

  if (filter?.theme) {
     query.theme = filter.theme;
  }
  
  const legos = await LegoModel.find(query).sort({ name: 1 });
  return legos.map(toLegoEntity);
}

export async function insertLego(lego: Partial<Lego>) {
  await dbConnect();
  return await LegoModel.create(lego);
}

export async function updateLego(id: string, updates: Partial<Lego>) {
  await dbConnect();
  return await LegoModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
}

export async function deleteLego(id: string) {
  await dbConnect();
  return await LegoModel.findByIdAndDelete(id);
}
