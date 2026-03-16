import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/db/client', () => ({
  getDb: vi.fn(() => ({})),
}));

vi.mock('better-auth', () => ({
  betterAuth: vi.fn((config) => config),
}));

vi.mock('better-auth/next-js', () => ({
  nextCookies: vi.fn(() => 'mock_nextCookies'),
}));

vi.mock('better-auth/plugins', () => ({
  admin: vi.fn(() => 'mock_admin'),
}));

vi.mock('better-auth/adapters/mongodb', () => ({
  mongodbAdapter: vi.fn(() => 'mock_mongodb_adapter'),
}));

describe('Given the better-auth config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('When AUTH_SECRET is missing', () => {
    it('Then it throws an error', async () => {
      // Given
      vi.stubEnv('AUTH_SECRET', '');
      
      // When/Then
      await expect(import('./auth')).rejects.toThrow('Missing AUTH_SECRET environment variable');
    });
  });

  describe('When DISCORD_CLIENT_ID is missing', () => {
    it('Then it throws an error', async () => {
      // Given
      vi.stubEnv('AUTH_SECRET', 'secret');
      vi.stubEnv('DISCORD_CLIENT_ID', '');
      
      // When/Then
      await expect(import('./auth')).rejects.toThrow('Missing DISCORD_CLIENT_ID environment variable');
    });
  });

  describe('When valid environment variables are provided', () => {
    it('Then it exports auth config correctly', async () => {
      // Given
      vi.stubEnv('AUTH_SECRET', 'secret');
      vi.stubEnv('DISCORD_CLIENT_ID', 'discord_id');
      vi.stubEnv('DISCORD_CLIENT_SECRET', 'discord_secret');
      vi.stubEnv('NODE_ENV', 'production');
      
      // When
      const { auth } = await import('./auth');
      
      // Then
      expect(auth.secret).toBe('secret');
      expect(auth.socialProviders.discord.clientId).toBe('discord_id');
      expect(auth.socialProviders.discord.clientSecret).toBe('discord_secret');
      expect(auth.advanced.useSecureCookies).toBe(true);
    });
  });

  describe('Given the user.create.before databaseHook', () => {
    describe('When user email is in ADMIN_EMAILS', () => {
      it('Then it sets the role to admin', async () => {
        // Given
        vi.stubEnv('AUTH_SECRET', 'secret');
        vi.stubEnv('DISCORD_CLIENT_ID', 'discord_id');
        vi.stubEnv('DISCORD_CLIENT_SECRET', 'discord_secret');
        vi.stubEnv('ADMIN_EMAILS', 'admin@example.com,boss@example.com');
        
        const { auth } = await import('./auth');
        const hookBefore = (auth as any).databaseHooks.user.create.before;
        
        // When
        const result = await hookBefore({ email: 'admin@example.com', name: 'Admin' });
        
        // Then
        expect(result.data.role).toBe('admin');
        expect(result.data.email).toBe('admin@example.com');
      });
    });

    describe('When user email is NOT in ADMIN_EMAILS', () => {
      it('Then it returns undefined and does not set admin role', async () => {
        // Given
        vi.stubEnv('AUTH_SECRET', 'secret');
        vi.stubEnv('DISCORD_CLIENT_ID', 'discord_id');
        vi.stubEnv('DISCORD_CLIENT_SECRET', 'discord_secret');
        vi.stubEnv('ADMIN_EMAILS', 'admin@example.com');
        
        const { auth } = await import('./auth');
        const hookBefore = (auth as any).databaseHooks.user.create.before;
        
        // When
        const result = await hookBefore({ email: 'user@example.com', name: 'User' });
        
        // Then
        expect(result).toBeUndefined();
      });
    });
      
    describe('When ADMIN_EMAILS is undefined', () => {
      it('Then it safely returns undefined without error', async () => {
        // Given
        vi.stubEnv('AUTH_SECRET', 'secret');
        vi.stubEnv('DISCORD_CLIENT_ID', 'discord_id');
        vi.stubEnv('DISCORD_CLIENT_SECRET', 'discord_secret');
        delete process.env.ADMIN_EMAILS;
        
        const { auth } = await import('./auth');
        const hookBefore = (auth as any).databaseHooks.user.create.before;
        
        // When
        const result = await hookBefore({ email: 'user@example.com' });
        
        // Then
        expect(result).toBeUndefined();
      });
    });
  });
});
