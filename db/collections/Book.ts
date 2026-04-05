import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { dbConnect } from "../mongoose";
import { z } from "zod";

export class Book {
  @prop({ required: true })
  title!: string;

  @prop()
  author?: string;

  @prop()
  isbn?: string;

  @prop()
  publisher?: string;

  @prop()
  yearPublished?: number;

  @prop()
  pages?: number;

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

/**
 * Zod schema for AI data extraction and validation.
 * Strictly typed against the Typegoose `Book` class to ensure the schema
 * always stays in sync with the database model.
 */
export const bookSchema: z.ZodType<Partial<Book>> = z.object({
  title: z.string().optional().describe('The title of the book'),
  author: z.string().optional().describe('The author of the book'),
  image: z.string().optional().describe('A valid url to an image cover of the book'),
  isbn: z.string().optional().describe('The ISBN-10 or ISBN-13 of the book'),
  publisher: z.string().optional().describe('The publisher of the book'),
  yearPublished: z.number().optional().describe('The year the book was published'),
  pages: z.number().optional().describe('The number of pages in the book'),
});

export const BookModel = mongoose.models.Book || getModelForClass(Book, {
  schemaOptions: { collection: 'book' }
});

export interface BookEntity extends Book {
  id: string;
}

import { DocumentType } from "@typegoose/typegoose";

function toBookEntity(doc: DocumentType<Book>): BookEntity {
  const obj = doc.toJSON() as unknown as { _id: unknown } & Record<string, unknown>;
  const { _id, ...rest } = obj;
  return {
    ...(rest as unknown as Book),
    id: String(_id),
  };
}

export function fromFormData(formData: FormData): Book {
  const title = formData.get('title')?.toString() || '';
  const author = formData.get('author')?.toString();
  const isbn = formData.get('isbn')?.toString();
  const publisher = formData.get('publisher')?.toString();
  const yearPublished = formData.get('yearPublished') ? parseInt(formData.get('yearPublished')!.toString(), 10) : undefined;
  const pages = formData.get('pages') ? parseInt(formData.get('pages')!.toString(), 10) : undefined;
  const image = formData.get('image')?.toString();

  if (!title) {
    throw new Error('Title is required');
  }

  return {
    title,
    author,
    isbn,
    publisher,
    yearPublished,
    pages,
    image,
  };
}
  
export interface BookFilter {
  search?: string;
}

export async function getBooks(filter?: BookFilter): Promise<BookEntity[]> {
  await dbConnect();
  
  const query: mongoose.QueryFilter<Book> = {};
  
  if (filter?.search) {
    query.title = { $regex: filter.search, $options: 'i' };
  }
  
  const books = await BookModel.find(query).sort({ title: 1 });
  return books.map(toBookEntity);
}

export async function insertBook(book: Partial<Book>) {
  await dbConnect();
  return await BookModel.create(book);
}

export async function updateBook(id: string, updates: Partial<Book>) {
  await dbConnect();
  return await BookModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
}

export async function deleteBook(id: string) {
  await dbConnect();
  return await BookModel.findByIdAndDelete(id);
}
