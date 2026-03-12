import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';

const { mockHash, mockCompare } = vi.hoisted(() => ({
  mockHash: vi.fn().mockResolvedValue('hashed_password'),
  mockCompare: vi.fn(),
}));

const { mockFindOne, mockInsertOne, mockCollection } = vi.hoisted(() => {
  const mockFindOne = vi.fn();
  const mockInsertOne = vi.fn();
  const mockCollection = { findOne: mockFindOne, insertOne: mockInsertOne };
  return { mockFindOne, mockInsertOne, mockCollection };
});

vi.mock('../client', () => ({
  getCollection: vi.fn().mockResolvedValue(mockCollection),
}));

vi.mock('bcryptjs', () => ({
  default: { hash: mockHash, compare: mockCompare },
}));

import { getUserByUsername, createUser, verifyPassword } from './User';
import bcrypt from 'bcryptjs';

describe('User Collection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByUsername', () => {
    it('returns the user when found', async () => {
      const user = { _id: new ObjectId(), username: 'alice', password: 'hash' };
      mockFindOne.mockResolvedValue(user);

      const result = await getUserByUsername('alice');

      expect(mockFindOne).toHaveBeenCalledWith({ username: 'alice' });
      expect(result).toBe(user);
    });

    it('returns null when the user is not found', async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await getUserByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('creates a new user with a hashed password', async () => {
      const insertedId = new ObjectId();
      mockFindOne.mockResolvedValue(null);
      mockInsertOne.mockResolvedValue({ insertedId });

      const result = await createUser('bob', 'password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockInsertOne).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'bob', password: 'hashed_password' }),
      );
      expect(result.username).toBe('bob');
      expect(result._id).toBe(insertedId);
    });

    it('throws when the username is already taken', async () => {
      mockFindOne.mockResolvedValue({ _id: new ObjectId(), username: 'bob', password: 'hash' });

      await expect(createUser('bob', 'password')).rejects.toThrow('User already exists');
      expect(mockInsertOne).not.toHaveBeenCalled();
    });
  });

  describe('verifyPassword', () => {
    const user = { _id: new ObjectId(), username: 'alice', password: 'stored_hash' } as any;

    it('returns true when the password matches', async () => {
      mockCompare.mockResolvedValue(true);

      const result = await verifyPassword(user, 'correct');

      expect(bcrypt.compare).toHaveBeenCalledWith('correct', 'stored_hash');
      expect(result).toBe(true);
    });

    it('returns false when the password does not match', async () => {
      mockCompare.mockResolvedValue(false);

      const result = await verifyPassword(user, 'wrong');

      expect(result).toBe(false);
    });
  });
});
