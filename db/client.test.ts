import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';

const { mockDb, mockMongoClient } = vi.hoisted(() => {
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

describe('Given the database client library module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('When MONGODB_URI is not provided', () => {
    it('Then it throws a missing variable error upon import', async () => {
      // Given
      vi.stubEnv('MONGODB_URI', '');
      
      // When/Then
      await expect(import('./client')).rejects.toThrow('Missing MONGODB_URI environment variable');
    });
  });

  describe('When MONGODB_URI is provided', () => {
    describe('When VERCEL_ENV is not production', () => {
      it('Then getDb uses the dev prefix', async () => {
        // Given
        vi.stubEnv('MONGODB_URI', 'mock-uri');
        vi.stubEnv('VERCEL_ENV', 'preview');

        // When
        const { getDb } = await import('./client');
        getDb();

        // Then
        expect(mockMongoClient.db).toHaveBeenCalledWith('dev_next_web');
      });
    });

    describe('When VERCEL_ENV is production', () => {
      it('Then getDb uses the prod prefix', async () => {
        // Given
        vi.stubEnv('MONGODB_URI', 'mock-uri');
        vi.stubEnv('VERCEL_ENV', 'production');

        // When
        const { getDb } = await import('./client');
        getDb();

        // Then
        expect(mockMongoClient.db).toHaveBeenCalledWith('prod_next_web');
      });
    });

    describe('When attempting to get a specific collection', () => {
      it('Then it returns the named collection from the active db', async () => {
        // Given
        vi.stubEnv('MONGODB_URI', 'mock-uri');
        vi.stubEnv('VERCEL_ENV', 'test');

        // When
        const { getCollection } = await import('./client');
        const col = await getCollection('boardgames');

        // Then
        expect(mockDb.collection).toHaveBeenCalledWith('boardgames');
        expect(col).toEqual({ mock: 'collection' });
      });
    });

    describe('When getMongoClient is called', () => {
      it('Then it returns the current static MongoClient instance', async () => {
        // Given
        vi.stubEnv('MONGODB_URI', 'mock-uri');

        // When
        const { getMongoClient } = await import('./client');
        const client = getMongoClient();

        // Then
        expect(client).toBe(mockMongoClient);
      });
    });
  });
});
