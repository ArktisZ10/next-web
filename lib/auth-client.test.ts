import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const { mockCreateAuthClient } = vi.hoisted(() => ({
  mockCreateAuthClient: vi.fn().mockReturnValue({ signOut: vi.fn(), useSession: vi.fn() }),
}));

vi.mock('better-auth/react', () => ({
  createAuthClient: mockCreateAuthClient,
}));

describe('auth-client / getBaseURL', () => {
  const savedEnv: Record<string, string | undefined> = {};
  const envKeys = ['NEXT_PUBLIC_APP_URL', 'VERCEL_URL', 'VERCEL_ENV'];

  beforeEach(() => {
    vi.resetModules();
    mockCreateAuthClient.mockClear();
    for (const key of envKeys) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
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

  it('uses NEXT_PUBLIC_APP_URL when set', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://my-app.example.com';

    await import('@/lib/auth-client');

    expect(mockCreateAuthClient).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'https://my-app.example.com' }),
    );
  });

  it('uses VERCEL_URL with https scheme when NEXT_PUBLIC_APP_URL is absent', async () => {
    process.env.VERCEL_URL = 'my-app.vercel.app';

    await import('@/lib/auth-client');

    expect(mockCreateAuthClient).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'https://my-app.vercel.app' }),
    );
  });

  it('falls back to localhost:3000 in local dev (no env vars set)', async () => {
    await import('@/lib/auth-client');

    expect(mockCreateAuthClient).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'http://localhost:3000' }),
    );
  });

  it('throws when VERCEL_ENV is production and no URL is configured', async () => {
    process.env.VERCEL_ENV = 'production';

    await expect(import('@/lib/auth-client')).rejects.toThrow(
      'Missing environment variable NEXT_PUBLIC_APP_URL',
    );
  });

  it('throws when VERCEL_ENV is development and no URL is configured', async () => {
    process.env.VERCEL_ENV = 'development';

    await expect(import('@/lib/auth-client')).rejects.toThrow(
      'Missing environment variable NEXT_PUBLIC_APP_URL',
    );
  });
});
