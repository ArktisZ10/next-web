import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  BookModel,
  insertBook,
  getBooks,
  updateBook,
  deleteBook,
  fromFormData,
} from './Book';
import { dbConnect } from '../mongoose';

let mongoServer: MongoMemoryServer;

describe('Given a connected MongoDB instance for books', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.VERCEL_ENV = 'test';
    
    await dbConnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await BookModel.deleteMany({});
  });

  describe('When inserting a new book', () => {
    it('Then it creates the database record and returns the document with an _id', async () => {
      // Given
      const book = {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        pages: 310,
        publisher: 'George Allen & Unwin',
        image: 'https://example.com/hobbit.jpg',
      };

      // When
      const inserted = await insertBook(book);
      
      // Then
      expect(inserted).toHaveProperty('_id');
      expect(inserted.title).toBe('The Hobbit');
      expect(inserted.pages).toBe(310);
      expect(inserted.image).toBe('https://example.com/hobbit.jpg');
    });
  });

  describe('When retrieving the list of books with filters', () => {
    it('Then it filters correctly by search', async () => {
      // Given
      await insertBook({ title: 'Foundation', author: 'Isaac Asimov' });
      await insertBook({ title: 'Dune', author: 'Frank Herbert' });
      await insertBook({ title: 'Neuromancer', author: 'William Gibson' });

      // When
      const searchBooks = await getBooks({ search: 'dun' });

      // Then
      expect(searchBooks).toHaveLength(1); // Dune
      expect(searchBooks.map(b => b.title)).toContain('Dune');
    });
  });

  describe('When retrieving the list of books', () => {
    it('Then it returns them sorted by title alphabetically and formats them as BookEntity', async () => {
      // Given
      await insertBook({ title: 'Foundation', author: 'Isaac Asimov' });
      await insertBook({ title: 'Dune', author: 'Frank Herbert' });
      await insertBook({ title: 'Neuromancer', author: 'William Gibson' });
      
      // When
      const books = await getBooks();
      
      // Then
      expect(books).toHaveLength(3);
      expect(books[0].title).toBe('Dune');
      expect(books[1].title).toBe('Foundation');
      expect(books[2].title).toBe('Neuromancer'); // Alphabetical sort check
      
      // Check type mapping to BookEntity (no _id, has id)
      expect(books[0]).not.toHaveProperty('_id');
      expect(books[0]).toHaveProperty('id');
      expect(typeof books[0].id).toBe('string');
    });
  });

  describe('When updating an existing book', () => {
    it('Then it changes the targeted properties while retaining the old unmodified ones', async () => {
      // Given
      const inserted = await insertBook({ title: 'Dune', author: 'Frank Herbert' });
      const id = inserted._id.toString();

      // When
      const updated = await updateBook(id, { title: 'Dune (Updated)', pages: 412 });
      
      // Then
      expect(updated).not.toBeNull();
      expect(updated?.title).toBe('Dune (Updated)');
      expect(updated?.pages).toBe(412);
      expect(updated?.author).toBe('Frank Herbert'); // Should retain old properties
    });
  });

  describe('When deleting a book', () => {
    it('Then it completely removes the document from the collection', async () => {
      // Given
      const inserted = await insertBook({ title: 'To Be Deleted' });
      const id = inserted._id.toString();

      let books = await getBooks();
      expect(books).toHaveLength(1);

      // When
      await deleteBook(id);

      // Then
      books = await getBooks();
      expect(books).toHaveLength(0);
    });
  });
});

describe('Given form data representing a book to be saved', () => {
  describe('When processing the form containing all fields', () => {
    it('Then it maps each field correctly to a Book object', () => {
      // Given
      const formData = new FormData();
      formData.append('title', 'Catch-22');
      formData.append('image', 'https://example.com/catch22.jpg');
      formData.append('author', 'Joseph Heller');
      formData.append('isbn', '9780684833392');
      formData.append('publisher', 'Simon & Schuster');
      formData.append('yearPublished', '1961');
      formData.append('pages', '453');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.title).toBe('Catch-22');
      expect(result.image).toBe('https://example.com/catch22.jpg');
      expect(result.author).toBe('Joseph Heller');
      expect(result.isbn).toBe('9780684833392');
      expect(result.publisher).toBe('Simon & Schuster');
      expect(result.yearPublished).toBe(1961);
      expect(result.pages).toBe(453);
    });
  });

  describe('When processing form data without optional fields', () => {
    it('Then it parses the title leaving other properties undefined', () => {
      // Given
      const formData = new FormData();
      formData.append('title', '1984');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.title).toBe('1984');
      expect(result.image).toBeUndefined();
      expect(result.author).toBeUndefined();
      expect(result.isbn).toBeUndefined();
      expect(result.publisher).toBeUndefined();
      expect(result.yearPublished).toBeUndefined();
      expect(result.pages).toBeUndefined();
    });
  });

  describe('When processing form data without a title', () => {
    it('Then it throws an error because title is required', () => {
      // Given
      const formData = new FormData();
      
      // When / Then
      expect(() => fromFormData(formData)).toThrow('Title is required');
    });
  });
});
