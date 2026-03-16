import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addBoardgameAction, editBoardgameAction, removeBoardgame } from './_actions';
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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

vi.mock('@/db/collections/Boardgame', () => ({
  insertBoardgame: vi.fn(),
  updateBoardgame: vi.fn(),
  deleteBoardgame: vi.fn(),
  fromFormData: vi.fn(() => ({ name: 'Mocked Game' }))
}));

describe('Given the Boardgame Server Actions', () => {
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
      it('Then addBoardgameAction throws an error indicating lack of write access', async () => {
        // Given/When
        const addPromise = addBoardgameAction(mockFormData);
        // Then
        await expect(addPromise).rejects.toThrow('User must have write access');
        expect(db.insertBoardgame).not.toHaveBeenCalled();
      });

      it('Then editBoardgameAction throws an error indicating lack of write access', async () => {
        // Given/When
        const editPromise = editBoardgameAction('123', mockFormData);
        // Then
        await expect(editPromise).rejects.toThrow('User must have write access');
        expect(db.updateBoardgame).not.toHaveBeenCalled();
      });

      it('Then removeBoardgame throws an error indicating lack of write access', async () => {
        // Given/When
        const removePromise = removeBoardgame(mockFormData);
        // Then
        await expect(removePromise).rejects.toThrow('User must have write access');
        expect(db.deleteBoardgame).not.toHaveBeenCalled();
      });
    } else {
      it('Then addBoardgameAction successfully processes and inserts the boardgame', async () => {
        // Given/When
        await addBoardgameAction(mockFormData);
        // Then
        expect(db.insertBoardgame).toHaveBeenCalledWith(
          expect.objectContaining({ addedBy: 'mock-user-1' })
        );
      });

      it('Then editBoardgameAction successfully processes and updates the boardgame', async () => {
        // Given/When
        await editBoardgameAction('123', mockFormData);
        // Then
        expect(db.updateBoardgame).toHaveBeenCalledWith('123',
          expect.objectContaining({ updatedBy: 'mock-user-1' })
        );
      });

      it('Then removeBoardgame successfully deletes the boardgame', async () => {
        // Given/When
        await removeBoardgame(mockFormData);
        // Then
        expect(db.deleteBoardgame).toHaveBeenCalledWith('123');
      });
    }
  });

  describe('When an admin attempts to remove a boardgame without providing an ID', () => {
    it('Then it throws a missing ID error', async () => {
      // Given
      vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: 'mock-user', role: 'admin' } } as any);
      const emptyFormData = new FormData();
      
      // When
      const removePromise = removeBoardgame(emptyFormData);
      
      // Then
      await expect(removePromise).rejects.toThrow('ID is required');
    });
  });
});
