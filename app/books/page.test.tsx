import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BooksPage from './page';
import { auth } from '@/lib/auth';
import * as db from '@/db/collections/Book';

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

vi.mock('@/db/collections/Book', () => ({
  getBooks: vi.fn()
}));

describe('Given the Books Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getBooks).mockResolvedValue([
      { id: '1', title: 'Test Book', author: 'Test Author', image: 'https://example.com/test.jpg', publisher: 'Test Pub', yearPublished: 2020 } as any,
      { id: '2', title: 'Another Book', pages: 300, isbn: '1234567890' } as any,
      { id: '3', title: 'Same Name Book', author: 'Another Author' } as any
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
      const ResolvedPage = await BooksPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Book')[0]).toBeInTheDocument();

      if (canEdit) {
        expect(screen.getAllByText('Add new book')[0]).toBeInTheDocument();
        expect(screen.getAllByText('New Book')[0]).toBeInTheDocument(); // The Upsert Modal hidden title
      } else {
        expect(screen.queryByText('Add new book')).not.toBeInTheDocument();
      }
    });
  });

  describe('When the current view is grid', () => {
    it('Then it renders the books as cards', async () => {
      // Given
      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'grid' })
      } as any);

      // When
      const searchParams = Promise.resolve({});
      const ResolvedPage = await BooksPage({ searchParams });
      render(ResolvedPage);

      // Then
      expect(screen.getAllByText('Test Book')[0]).toBeInTheDocument();
      // Test Book and Another Book cards should render, check for "No Image" text from the placeholder
      expect(screen.getAllByText('No Image')[0]).toBeInTheDocument();
    });
  });
});
