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
  headers: vi.fn(() => new Headers())
}));

vi.mock('@/db/collections/Boardgame', () => ({
  getBoardgames: vi.fn()
}));

describe('Given the BoardGames Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getBoardgames).mockResolvedValue([
      { id: '1', name: 'Test Game', minPlayers: 2, maxPlayers: 4, image: 'https://example.com/test.jpg' } as any,
      { id: '2', name: 'Another Game', minPlayTime: 30, maxPlayTime: 60 } as any
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
      const ResolvedPage = await BoardGamesPage();
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Game')[0]).toBeInTheDocument();

      if (canEdit) {
        expect(screen.getAllByText('Add new boardgame')[0]).toBeInTheDocument();
        expect(screen.getAllByText('New Boardgame')[0]).toBeInTheDocument(); // The Upsert Modal hidden title
      } else {
        expect(screen.queryByText('Add new boardgame')).not.toBeInTheDocument();
      }
    });
  });
});
