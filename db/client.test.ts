import { vi, describe, it, expect, afterEach } from 'vitest';

const { mockDb, mockMongoClient } = vi.hoisted(() => {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
  const mockDb = { collection: vi.fn().mockReturnValue({ mock: 'collection' }) };
  const mockMongoClient = { db: vi.fn().mockReturnValue(mockDb) };
  return { mockDb, mockMongoClient };
});

vi.mock('mongodb', () => ({
  // Use a class so `new MongoClient(...)` works correctly
  MongoClient: class {
    constructor() {
      return mockMongoClient;
    }
  },
}));

vi.mock('@vercel/functions', () => ({
  attachDatabasePool: vi.fn(),
}));

import { getDb, getCollection, getMongoClient } from './client';

describe('db/client', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getDb', () => {
    it('uses dev prefix when VERCEL_ENV is not production', () => {
      process.env.VERCEL_ENV = 'preview';
      getDb();
      expect(mockMongoClient.db).toHaveBeenCalledWith('dev_next_web');
    });

    it('uses prod prefix when VERCEL_ENV is production', () => {
      process.env.VERCEL_ENV = 'production';
      getDb();
      expect(mockMongoClient.db).toHaveBeenCalledWith('prod_next_web');
    });
  });

  describe('getCollection', () => {
    it('returns the named collection from the db', async () => {
      process.env.VERCEL_ENV = 'test';
      const col = await getCollection('boardgames');
      expect(mockDb.collection).toHaveBeenCalledWith('boardgames');
      expect(col).toEqual({ mock: 'collection' });
    });
  });

  describe('getMongoClient', () => {
    it('returns the MongoClient instance', () => {
      const client = getMongoClient();
      expect(client).toBe(mockMongoClient);
    });
  });
});
