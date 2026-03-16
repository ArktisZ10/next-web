import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminPage from './page';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';

const { headersMock, getSessionMock } = vi.hoisted(() => {
  return {
    headersMock: vi.fn(() => new Headers()),
    getSessionMock: vi.fn()
  }
});

vi.mock('next/headers', () => ({
  headers: headersMock
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: any[]) => getSessionMock(...args)
    }
  }
}));

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;

vi.mock('@/db/client', () => ({
  getDb: vi.fn(() => {
    return mongoClient.db('test_db');
  })
}));

describe('Given the Admin User Management Page', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    const db = mongoClient.db('test_db');
    await db.collection("user").insertMany([
      { _id: new ObjectId(), name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { _id: new ObjectId(), id: 'string-id', name: 'Regular User', email: 'user@example.com' }
    ]);
  });

  afterAll(async () => {
    if (mongoClient) {
      await mongoClient.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('When a user who is not an admin tries to access the page', () => {
    it('Then it redirects the user to the home page', async () => {
      // Given
      getSessionMock.mockResolvedValueOnce({ user: { role: 'user' } });
      
      // When
      await AdminPage();
      const { redirect } = await import('next/navigation');
      
      // Then
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('When a valid admin user accesses the page', () => {
    it('Then it renders the user management table and lists users', async () => {
      // Given
      getSessionMock.mockResolvedValueOnce({ user: { role: 'admin' } });
      
      // When
      const page = await AdminPage();
      render(page);
      
      // Then
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
      
      // Default fallback from "role || 'read-only'" 
      expect(screen.getAllByText('read-only')[0]).toBeInTheDocument();
    });
  });
});
