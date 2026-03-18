import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addBookAction, editBookAction, removeBook } from './_actions';
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
  cookies: vi.fn(() => ({
    set: vi.fn()
  }))
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

vi.mock('@/db/collections/Book', () => ({
  insertBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  fromFormData: vi.fn(() => ({ name: 'Mocked Book' }))
}));

describe('Given the Book Server Actions', () => {
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append('id', '123');
    vi.clearAllMocks();
  });

  const testCases = [
    { role: null, canEdit: false },
    { role: undefined, canEdit: false },
    { role: 'read-only', canEdit: false },
    { role: 'write', canEdit: true },
    { role: 'admin', canEdit: true },
  ];

  describe.each(testCases)('When a user with role \'$role\' performs actions', ({ role, canEdit }) => {
    beforeEach(() => {
      vi.mocked(auth.api.getSession).mockResolvedValue(
        role === null 
          ? null 
          : { user: { id: 'mock-user-1', role } } as any
      );
    });

    if (!canEdit) {
      it('Then addBookAction throws an error indicating lack of write access', async () => {
        // Given/When
        const addPromise = addBookAction(mockFormData);
        // Then
        await expect(addPromise).rejects.toThrow('User must have write access');
        expect(db.insertBook).not.toHaveBeenCalled();
      });

      it('Then editBookAction throws an error indicating lack of write access', async () => {
        // Given/When
        const editPromise = editBookAction('123', mockFormData);
        // Then
        await expect(editPromise).rejects.toThrow('User must have write access');
        expect(db.updateBook).not.toHaveBeenCalled();
      });

      it('Then removeBook throws an error indicating lack of write access', async () => {
        // Given/When
        const removePromise = removeBook(mockFormData);
        // Then
        await expect(removePromise).rejects.toThrow('User must have write access');
        expect(db.deleteBook).not.toHaveBeenCalled();
      });
    } else {
      it('Then addBookAction successfully processes and inserts the book', async () => {
        // Given/When
        await addBookAction(mockFormData);
        // Then
        expect(db.insertBook).toHaveBeenCalledWith(
          expect.objectContaining({ addedBy: 'mock-user-1' })
        );
      });

      it('Then editBookAction successfully processes and updates the book', async () => {
        // Given/When
        await editBookAction('123', mockFormData);
        // Then
        expect(db.updateBook).toHaveBeenCalledWith('123',
          expect.objectContaining({ updatedBy: 'mock-user-1' })
        );
      });

      it('Then removeBook successfully deletes the book', async () => {
        // Given/When
        await removeBook(mockFormData);
        // Then
        expect(db.deleteBook).toHaveBeenCalledWith('123');
      });
    }
  });

  describe('When an admin attempts to remove a book without providing an ID', () => {
    it('Then it throws a missing ID error', async () => {
      // Given
      vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: 'mock-user', role: 'admin' } } as any);
      const emptyFormData = new FormData();
      
      // When
      const removePromise = removeBook(emptyFormData);
      
      // Then
      await expect(removePromise).rejects.toThrow('ID is required');
    });
  });
});