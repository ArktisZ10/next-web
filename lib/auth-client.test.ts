// @vitest-environment node
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const { mockCreateAuthClient } = vi.hoisted(() => ({
  mockCreateAuthClient: vi.fn().mockReturnValue({ signOut: vi.fn(), useSession: vi.fn() }),
}));

vi.mock('better-auth/react', () => ({
  createAuthClient: mockCreateAuthClient,
}));

describe('Given the getBaseURL logic in auth-client', () => {
  const savedEnv: Record<string, string | undefined> = {};
  const envKeys = ['NEXT_PUBLIC_APP_URL', 'VERCEL_URL', 'VERCEL_ENV'];

  beforeEach(() => {
    vi.resetModules();
    mockCreateAuthClient.mockClear();
    for (const key of envKeys) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
    // ensure window is not defined to trigger node environment block
    // @ts-ignore
    delete globalThis.window;
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (savedEnv[key] !== undefined) {
        process.env[key] = savedEnv[key];
      } else {
        delete process.env[key];
      }
    }
  });

  describe('When Server Side with NEXT_PUBLIC_APP_URL', () => {
    it('Then it uses NEXT_PUBLIC_APP_URL', async () => {
      // Given
      process.env.NEXT_PUBLIC_APP_URL = 'https://my-app.example.com';

      // When
      await import('@/lib/auth-client');

      // Then
      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'https://my-app.example.com' }),
      );
    });
  });

  describe('When Server Side without explicit URL but has VERCEL_URL', () => {
    it('Then it uses VERCEL_URL with https scheme', async () => {
      // Given
      process.env.VERCEL_URL = 'my-app.vercel.app';

      // When
      await import('@/lib/auth-client');

      // Then
      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'https://my-app.vercel.app' }),
      );
    });
  });

  describe('When Local dev environment without URL vars set', () => {
    it('Then it falls back to localhost:3000', async () => {
      // Given/When
      await import('@/lib/auth-client');

      // Then
      expect(mockCreateAuthClient).toHaveBeenCalledWith(
        expect.objectContaining({ baseURL: 'http://localhost:3000' }),
      );
    });
  });

  describe('When production environment without URL configured', () => {
    it('Then it throws an error to prevent localhost leak', async () => {
      // Given
      process.env.VERCEL_ENV = 'production';

      // When/Then
      await expect(import('@/lib/auth-client')).rejects.toThrow(
        'Missing environment variable NEXT_PUBLIC_APP_URL',
      );
    });
  });

  describe('When development environment on Vercel without URL configured', () => {
    it('Then it throws an error to prevent localhost leak', async () => {
      // Given
      process.env.VERCEL_ENV = 'development';

      // When/Then
      await expect(import('@/lib/auth-client')).rejects.toThrow(
        'Missing environment variable NEXT_PUBLIC_APP_URL',
      );
    });
  });
});
