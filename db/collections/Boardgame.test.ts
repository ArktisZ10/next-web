import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  BoardgameModel,
  insertBoardgame,
  getBoardgames,
  updateBoardgame,
  deleteBoardgame,
  fromFormData,
} from './Boardgame';
import { dbConnect } from '../mongoose';

let mongoServer: MongoMemoryServer;

describe('Given a connected MongoDB instance for boardgames', () => {
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
    await BoardgameModel.deleteMany({});
  });

  describe('When inserting a new boardgame', () => {
    it('Then it creates the database record and returns the document with an _id', async () => {
      // Given
      const game = {
        name: 'Settlers of Catan',
        minPlayers: 3,
        maxPlayers: 4,
        publisher: 'Kosmos',
      };

      // When
      const inserted = await insertBoardgame(game);
      
      // Then
      expect(inserted).toHaveProperty('_id');
      expect(inserted.name).toBe('Settlers of Catan');
      expect(inserted.minPlayers).toBe(3);
    });
  });

  describe('When retrieving the list of boardgames', () => {
    it('Then it returns them sorted by name alphabetically and formats them as BoardgameEntity', async () => {
      // Given
      await insertBoardgame({ name: 'Zombicide', minPlayers: 1, maxPlayers: 6 });
      await insertBoardgame({ name: 'Catan', minPlayers: 3, maxPlayers: 4 });
      await insertBoardgame({ name: 'Ticket to Ride', minPlayers: 2, maxPlayers: 5 });
      
      // When
      const games = await getBoardgames();
      
      // Then
      expect(games).toHaveLength(3);
      expect(games[0].name).toBe('Catan');
      expect(games[1].name).toBe('Ticket to Ride');
      expect(games[2].name).toBe('Zombicide'); // Alphabetical sort check
      
      // Check type mapping to BoardgameEntity (no _id, has id)
      expect(games[0]).not.toHaveProperty('_id');
      expect(games[0]).toHaveProperty('id');
      expect(typeof games[0].id).toBe('string');
    });
  });

  describe('When updating an existing boardgame', () => {
    it('Then it changes the targeted properties while retaining the old unmodified ones', async () => {
      // Given
      const inserted = await insertBoardgame({ name: 'Catan', minPlayers: 3 });
      const id = inserted._id.toString();

      // When
      const updated = await updateBoardgame(id, { name: 'Catan (Updated)', maxPlayers: 6 });
      
      // Then
      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Catan (Updated)');
      expect(updated?.maxPlayers).toBe(6);
      expect(updated?.minPlayers).toBe(3); // Should retain old properties
    });
  });

  describe('When deleting a boardgame', () => {
    it('Then it completely removes the document from the collection', async () => {
      // Given
      const inserted = await insertBoardgame({ name: 'To Be Deleted' });
      const id = inserted._id.toString();

      let games = await getBoardgames();
      expect(games).toHaveLength(1);

      // When
      await deleteBoardgame(id);

      // Then
      games = await getBoardgames();
      expect(games).toHaveLength(0);
    });
  });
});

describe('Given form data representing a boardgame to be saved', () => {
  describe('When processing the form containing all fields', () => {
    it('Then it maps each field correctly to a BoardgameInput object', () => {
      // Given
      const formData = new FormData();
      formData.append('name', 'Chess');
      formData.append('players_min', '2');
      formData.append('players_max', '2');
      formData.append('playtime_min', '30');
      formData.append('playtime_max', '60');
      formData.append('publisher', 'FIDE');
      formData.append('year_published', '1886');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.name).toBe('Chess');
      expect(result.minPlayers).toBe(2);
      expect(result.maxPlayers).toBe(2);
      expect(result.minPlayTime).toBe(30);
      expect(result.maxPlayTime).toBe(60);
      expect(result.publisher).toBe('FIDE');
      expect(result.yearPublished).toBe(1886);
    });
  });

  describe('When processing form data without optional fields', () => {
    it('Then it parses the name leaving other properties undefined', () => {
      // Given
      const formData = new FormData();
      formData.append('name', 'Go');

      // When
      const result = fromFormData(formData);

      // Then
      expect(result.name).toBe('Go');
      expect(result.minPlayers).toBeUndefined();
      expect(result.maxPlayers).toBeUndefined();
      expect(result.publisher).toBeUndefined();
      expect(result.yearPublished).toBeUndefined();
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
