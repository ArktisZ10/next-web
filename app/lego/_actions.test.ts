import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addLegoAction, editLegoAction, removeLego } from './_actions';
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
  cookies: vi.fn(() => ({
    set: vi.fn()
  }))
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

vi.mock('@/db/collections/Lego', () => ({
  insertLego: vi.fn(),
  updateLego: vi.fn(),
  deleteLego: vi.fn(),
  fromFormData: vi.fn(() => ({ name: 'Mocked Lego' }))
}));

describe('Given the Lego Server Actions', () => {
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
      it('Then addLegoAction throws an error indicating lack of write access', async () => {
        // Given/When
        const addPromise = addLegoAction(mockFormData);
        // Then
        await expect(addPromise).rejects.toThrow('User must have write access');
        expect(db.insertLego).not.toHaveBeenCalled();
      });

      it('Then editLegoAction throws an error indicating lack of write access', async () => {
        // Given/When
        const editPromise = editLegoAction('123', mockFormData);
        // Then
        await expect(editPromise).rejects.toThrow('User must have write access');
        expect(db.updateLego).not.toHaveBeenCalled();
      });

      it('Then removeLego throws an error indicating lack of write access', async () => {
        // Given/When
        const removePromise = removeLego(mockFormData);
        // Then
        await expect(removePromise).rejects.toThrow('User must have write access');
        expect(db.deleteLego).not.toHaveBeenCalled();
      });
    } else {
      it('Then addLegoAction successfully processes and inserts the lego', async () => {
        // Given/When
        await addLegoAction(mockFormData);
        // Then
        expect(db.insertLego).toHaveBeenCalledWith(
          expect.objectContaining({ addedBy: 'mock-user-1' })
        );
      });

      it('Then editLegoAction successfully processes and updates the lego', async () => {
        // Given/When
        await editLegoAction('123', mockFormData);
        // Then
        expect(db.updateLego).toHaveBeenCalledWith('123',
          expect.objectContaining({ updatedBy: 'mock-user-1' })
        );
      });

      it('Then removeLego successfully deletes the lego', async () => {
        // Given/When
        await removeLego(mockFormData);
        // Then
        expect(db.deleteLego).toHaveBeenCalledWith('123');
      });
    }
  });

  describe('When an admin attempts to remove a lego without providing an ID', () => {
    it('Then it throws a missing ID error', async () => {
      // Given
      vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: 'mock-user', role: 'admin' } } as any);
      const emptyFormData = new FormData();
      
      // When
      const removePromise = removeLego(emptyFormData);
      
      // Then
      await expect(removePromise).rejects.toThrow('ID is required');
    });
  });
});