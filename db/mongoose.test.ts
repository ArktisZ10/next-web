import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockConnect = vi.fn();

vi.mock('mongoose', () => ({
  default: { connect: mockConnect },
}));

describe('Given the database connection manager (dbConnect)', () => {
  let origUri: string | undefined;

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    (global as any).mongoose = undefined;
    origUri = process.env.MONGODB_URI;
    mockConnect.mockReset();
  });

  afterEach(() => {
    if (origUri !== undefined) {
      process.env.MONGODB_URI = origUri;
    } else {
      delete process.env.MONGODB_URI;
    }
    vi.unstubAllEnvs();
  });

  describe('When a global mongoose cache already exists', () => {
    it('Then it preserves and returns the existing cached connection', async () => {
      // Given
      (global as any).mongoose = { conn: 'mock-conn', promise: null };
      vi.stubEnv('MONGODB_URI', 'mongodb://localhost');
      
      const { dbConnect } = await import('./mongoose');
      
      // When
      const conn = await dbConnect();
      
      // Then
      expect(conn).toBe('mock-conn');
    });
  });

  describe('When MONGODB_URI is not defined in the environment', () => {
    it('Then it throws an error demanding the variable', async () => {
      // Given
      const { dbConnect } = await import('./mongoose');
      
      // When/Then
      await expect(dbConnect()).rejects.toThrow('Please define the MONGODB_URI');
    });
  });

  describe('When called in a non-production environment', () => {
    it('Then it connects and returns the connection configured for development', async () => {
      // Given
      vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/test');
      vi.stubEnv('VERCEL_ENV', 'development');
      const mockConn = { isConnected: true };
      mockConnect.mockResolvedValue(mockConn);

      const { dbConnect } = await import('./mongoose');
      
      // When
      const conn = await dbConnect();

      // Then
      expect(mockConnect).toHaveBeenCalledWith(
        'mongodb://localhost:27017/test', 
        expect.objectContaining({ dbName: 'dev_next_web' })
      );
      expect(conn).toBe(mockConn);
    });
  });

  describe('When called in a production environment', () => {
    it('Then it connects and returns the connection configured for production', async () => {
      // Given
      vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/test');
      vi.stubEnv('VERCEL_ENV', 'production');
      const mockConn = { isConnected: true };
      mockConnect.mockResolvedValue(mockConn);

      const { dbConnect } = await import('./mongoose');
      
      // When
      const conn = await dbConnect();

      // Then
      expect(mockConnect).toHaveBeenCalledWith(
        'mongodb://localhost:27017/test', 
        expect.objectContaining({ dbName: 'prod_next_web' })
      );
      expect(conn).toBe(mockConn);
    });
  });

  describe('When called sequentially multiple times', () => {
    it('Then it returns the cached connection on subsequent calls', async () => {
      // Given
      vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/test');
      const mockConn = { isConnected: true };
      mockConnect.mockResolvedValue(mockConn);

      const { dbConnect } = await import('./mongoose');
      
      // When
      const conn1 = await dbConnect();
      const conn2 = await dbConnect();

      // Then
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(conn1).toBe(conn2);
    });
  });

  describe('When the connection fails initially and is retried', () => {
    it('Then it resets the promise and rethrows, allowing a retry to succeed', async () => {
      // Given
      vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/test');
      mockConnect.mockRejectedValueOnce(new Error('connection refused'));

      const { dbConnect } = await import('./mongoose');
      
      // When/Then
      await expect(dbConnect()).rejects.toThrow('connection refused');

      // Given (After failure cached.promise is reset to null)
      const mockConn = { isConnected: true };
      mockConnect.mockResolvedValue(mockConn);
      
      // When
      const conn = await dbConnect();

      // Then
      expect(mockConnect).toHaveBeenCalledTimes(2);
      expect(conn).toBe(mockConn);
    });
  });
});
