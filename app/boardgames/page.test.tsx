import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BoardGamesPage from './page';
import { auth } from '@/lib/auth';
import * as db from '@/db/collections/Boardgame';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
  cookies: vi.fn(() => ({ get: vi.fn() }))
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams())
}));

vi.mock('@/db/collections/Boardgame', () => ({
  getBoardgames: vi.fn()
}));

describe('Given the BoardGames Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getBoardgames).mockResolvedValue([
      { id: '1', name: 'Test Game', minPlayers: 2, maxPlayers: 4, image: 'https://example.com/test.jpg', publisher: 'Test Pub', yearPublished: 2020 } as any,
      { id: '2', name: 'Another Game', minPlayTime: 30, maxPlayTime: 60 } as any,
      { id: '3', name: 'Same Number Game', minPlayers: 4, maxPlayers: 4, minPlayTime: 45, maxPlayTime: 45 } as any
    ]);
  });

  const testCases = [
    { role: null, canEdit: false },
    { role: undefined, canEdit: false },
    { role: 'read-only', canEdit: false },
    { role: 'write', canEdit: true },
    { role: 'admin', canEdit: true },
  ];

  describe.each(testCases)('When accessed by a user with role: $role', ({ role, canEdit }) => {
    it(`Then it ${canEdit ? 'shows' : 'hides'} the edit/delete/add controls appropriately`, async () => {
      // Given
      vi.mocked(auth.api.getSession).mockResolvedValue(
        role === null 
          ? null 
          : { user: { id: 'mock-user-1', role } } as any
      );

      // When
      const searchParams = Promise.resolve({});
      const ResolvedPage = await BoardGamesPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Game')[0]).toBeInTheDocument();

      if (canEdit) {
        expect(screen.getAllByText('Add new board game')[0]).toBeInTheDocument();
        expect(screen.getAllByText('New Board Game')[0]).toBeInTheDocument(); // The Upsert Modal hidden title
      } else {
        expect(screen.queryByText('Add new board game')).not.toBeInTheDocument();
      }
    });
  });

  describe('When the current view is grid', () => {
    it('Then it renders the board games as cards', async () => {
      // Given
      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'grid' })
      } as any);

      // When
      const searchParams = Promise.resolve({});
      const ResolvedPage = await BoardGamesPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Game')[0]).toBeInTheDocument();
      // Test Game and Another Game cards should render, check for "No Image" text from the placeholder
      expect(screen.getAllByText('No Image')[0]).toBeInTheDocument();
    });
  });

  describe('When search parameters are provided', () => {
    it('Then it passes the valid parsed parameters to getBoardgames', async () => {
      // Given
      const searchParams = Promise.resolve({
        q: 'Catan',
        players: '4',
        playtime: '60'
      });

      // When
      await BoardGamesPage({ searchParams });

      // Then
      expect(db.getBoardgames).toHaveBeenCalledWith({
        search: 'Catan',
        players: 4,
        playtime: 60
      });
    });

    it('Then it ignores invalid parsed parameters (NaN) for players and playtime', async () => {
      // Given
      const searchParams = Promise.resolve({
        q: 'Catan',
        players: 'invalid',
        playtime: 'invalid'
      });

      // When
      await BoardGamesPage({ searchParams });

      // Then
      expect(db.getBoardgames).toHaveBeenCalledWith({
        search: 'Catan',
        players: undefined,
        playtime: undefined
      });
    });
  });
});
