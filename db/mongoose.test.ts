import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockConnect = vi.fn();

vi.mock('mongoose', () => ({
  default: { connect: mockConnect },
}));

describe('dbConnect', () => {
  let origUri: string | undefined;

  beforeEach(() => {
    vi.resetModules();
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
  });

  it('throws when MONGODB_URI is not defined', async () => {
    delete process.env.MONGODB_URI;
    const { dbConnect } = await import('./mongoose');
    await expect(dbConnect()).rejects.toThrow('Please define the MONGODB_URI');
  });

  it('connects and returns the connection', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    const mockConn = { isConnected: true };
    mockConnect.mockResolvedValue(mockConn);

    const { dbConnect } = await import('./mongoose');
    const conn = await dbConnect();

    expect(mockConnect).toHaveBeenCalledOnce();
    expect(conn).toBe(mockConn);
  });

  it('returns the cached connection on subsequent calls', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    const mockConn = { isConnected: true };
    mockConnect.mockResolvedValue(mockConn);

    const { dbConnect } = await import('./mongoose');
    const conn1 = await dbConnect();
    const conn2 = await dbConnect();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(conn1).toBe(conn2);
  });

  it('resets the promise and rethrows on connection failure, allowing retry', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    mockConnect.mockRejectedValueOnce(new Error('connection refused'));

    const { dbConnect } = await import('./mongoose');
    await expect(dbConnect()).rejects.toThrow('connection refused');

    // After failure cached.promise is reset to null — next call retries
    const mockConn = { isConnected: true };
    mockConnect.mockResolvedValue(mockConn);
    const conn = await dbConnect();

    expect(mockConnect).toHaveBeenCalledTimes(2);
    expect(conn).toBe(mockConn);
  });
});
