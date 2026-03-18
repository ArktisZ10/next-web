import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  LegoModel,
  insertLego,
  getLegos,
  updateLego,
  deleteLego,
  fromFormData,
} from './Lego';
import { dbConnect } from '../mongoose';

let mongoServer: MongoMemoryServer;

describe('Given a connected MongoDB instance for legos', () => {
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
    await LegoModel.deleteMany({});
  });

  describe('When inserting a new lego set', () => {
    it('Then it creates the database record and returns the document with an _id', async () => {
      // Given
      const legoSet = {
        name: 'Millennium Falcon',
        setNumber: '75192',
        theme: 'Star Wars',
        pieceCount: 7541,
        image: 'https://example.com/falcon.jpg',
      };

      // When
      const inserted = await insertLego(legoSet);
      
      // Then
      expect(inserted).toHaveProperty('_id');
      expect(inserted.name).toBe('Millennium Falcon');
      expect(inserted.pieceCount).toBe(7541);
      expect(inserted.image).toBe('https://example.com/falcon.jpg');
    });
  });

  describe('When retrieving the list of lego sets with filters', () => {
    it('Then it filters correctly by search and theme', async () => {
      // Given
      await insertLego({ name: 'Hogwarts Castle', theme: 'Harry Potter' });
      await insertLego({ name: 'X-Wing Starfighter', theme: 'Star Wars' });
      await insertLego({ name: 'Daily Bugle', theme: 'Marvel' });

      // When
      const searchLegos = await getLegos({ search: 'hog' });
      const themeLegos = await getLegos({ theme: 'Star Wars' });

      // Then
      expect(searchLegos).toHaveLength(1); // Hogwarts Castle
      expect(searchLegos.map(l => l.name)).toContain('Hogwarts Castle');

      expect(themeLegos).toHaveLength(1); // X-Wing Starfighter
      expect(themeLegos.map(l => l.name)).toContain('X-Wing Starfighter');
    });
  });

  describe('When retrieving the list of lego sets', () => {
    it('Then it returns them sorted by name alphabetically and formats them as LegoEntity', async () => {
      // Given
      await insertLego({ name: 'Hogwarts Castle' });
      await insertLego({ name: 'X-Wing Starfighter' });
      await insertLego({ name: 'Daily Bugle' });
      
      // When
      const legos = await getLegos();
      
      // Then
      expect(legos).toHaveLength(3);
      expect(legos[0].name).toBe('Daily Bugle');
      expect(legos[1].name).toBe('Hogwarts Castle');
      expect(legos[2].name).toBe('X-Wing Starfighter'); // Alphabetical sort check
      
      // Check type mapping to LegoEntity (no _id, has id)
      expect(legos[0]).not.toHaveProperty('_id');
      expect(legos[0]).toHaveProperty('id');
      expect(typeof legos[0].id).toBe('string');
    });
  });

  describe('When updating an existing lego set', () => {
    it('Then it changes the targeted properties while retaining the old unmodified ones', async () => {
      // Given
      const inserted = await insertLego({ name: 'Daily Bugle', theme: 'Marvel' });
      const id = inserted._id.toString();

      // When
      const updated = await updateLego(id, { name: 'Daily Bugle (Updated)', pieceCount: 3772 });
      
      // Then
      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Daily Bugle (Updated)');
      expect(updated?.pieceCount).toBe(3772);
      expect(updated?.theme).toBe('Marvel'); // Should retain old properties
    });
  });

  describe('When deleting a lego set', () => {
    it('Then it completely removes the document from the collection', async () => {
      // Given
      const inserted = await insertLego({ name: 'To Be Deleted' });
      const id = inserted._id.toString();

      let legos = await getLegos();
      expect(legos).toHaveLength(1);

      // When
      await deleteLego(id);

      // Then
      legos = await getLegos();
      expect(legos).toHaveLength(0);
    });
  });
});

describe('Given form data representing a lego set to be saved', () => {
  describe('When processing the form containing all fields', () => {
    it('Then it maps each field correctly to a Lego object', () => {
      // Given
      const formData = new FormData();
      formData.append('name', 'Boutique Hotel');
      formData.append('image', 'https://example.com/hotel.jpg');
      formData.append('setNumber', '10297');
      formData.append('theme', 'Icons');
      formData.append('pieceCount', '3066');
      formData.append('minifigures', '7');
      formData.append('yearReleased', '2022');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.name).toBe('Boutique Hotel');
      expect(result.image).toBe('https://example.com/hotel.jpg');
      expect(result.setNumber).toBe('10297');
      expect(result.theme).toBe('Icons');
      expect(result.pieceCount).toBe(3066);
      expect(result.minifigures).toBe(7);
      expect(result.yearReleased).toBe(2022);
    });
  });

  describe('When processing form data without optional fields', () => {
    it('Then it parses the name leaving other properties undefined', () => {
      // Given
      const formData = new FormData();
      formData.append('name', 'Basic Bricks');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.name).toBe('Basic Bricks');
      expect(result.image).toBeUndefined();
      expect(result.setNumber).toBeUndefined();
      expect(result.theme).toBeUndefined();
      expect(result.pieceCount).toBeUndefined();
      expect(result.minifigures).toBeUndefined();
      expect(result.yearReleased).toBeUndefined();
    });
  });

  describe('When processing form data without a name', () => {
    it('Then it throws an error because name is required', () => {
      // Given
      const formData = new FormData();
      
      // When / Then
      expect(() => fromFormData(formData)).toThrow('Name is required');
    });
  });
});
