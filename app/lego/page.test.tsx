import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegoPage from './page';
import { auth } from '@/lib/auth';
import * as db from '@/db/collections/Lego';

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

vi.mock('@/db/collections/Lego', () => ({
  getLegos: vi.fn()
}));

describe('Given the Lego Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getLegos).mockResolvedValue([
      { id: '1', name: 'Test Lego', setNumber: '123', pieceCount: 100, image: 'https://example.com/test.jpg', theme: 'Test Theme', yearReleased: 2020, minifigures: 2 } as any,
      { id: '2', name: 'Another Lego', setNumber: '456', pieceCount: 200 } as any,
      { id: '3', name: 'Same Number Lego', pieceCount: 300 } as any,
      { id: '4', name: 'No Details Lego' } as any
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
      const ResolvedPage = await LegoPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Lego')[0]).toBeInTheDocument();

      if (canEdit) {
        expect(screen.getAllByText('Add new lego')[0]).toBeInTheDocument();
        expect(screen.getAllByText('New Lego')[0]).toBeInTheDocument(); // The Upsert Modal hidden title
      } else {
        expect(screen.queryByText('Add new lego')).not.toBeInTheDocument();
      }
    });
  });

  describe('When the current view is grid', () => {
    it('Then it renders the legos as cards', async () => {
      // Given
      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'grid' })
      } as any);

      // When
      const searchParams = Promise.resolve({});
      const ResolvedPage = await LegoPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Lego')[0]).toBeInTheDocument();
      // Test Lego and Another Lego cards should render, check for "No Image" text from the placeholder
      expect(screen.getAllByText('No Image')[0]).toBeInTheDocument();
    });
  });
});
