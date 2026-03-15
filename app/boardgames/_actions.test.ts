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

describe('Boardgame Server Actions (Authentication check)', () => {
  let mockFormData: FormData;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append('id', '123');
    vi.clearAllMocks();
  });

  describe('Unauthenticated interactions', () => {
    beforeEach(() => {
      // Return null to simulate no user session
      vi.mocked(auth.api.getSession).mockResolvedValue(null);
    });

    it('addBoardgameAction should throw if not authenticated', async () => {
      await expect(addBoardgameAction(mockFormData)).rejects.toThrow('User must have write access');
      expect(db.insertBoardgame).not.toHaveBeenCalled();
    });

    it('editBoardgameAction should throw if not authenticated', async () => {
      await expect(editBoardgameAction('123', mockFormData)).rejects.toThrow('User must have write access');
      expect(db.updateBoardgame).not.toHaveBeenCalled();
    });

    it('removeBoardgame should throw if not authenticated', async () => {
      await expect(removeBoardgame(mockFormData)).rejects.toThrow('User must have write access');
      expect(db.deleteBoardgame).not.toHaveBeenCalled();
    });
  });

  describe('Authenticated interactions', () => {
    beforeEach(() => {
      // Return a dummy session
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: { id: 'mock-user-1', role: 'admin' },
      } as any);
    });

    it('addBoardgameAction should process and insert as authenticated user', async () => {
      await addBoardgameAction(mockFormData);
      expect(db.insertBoardgame).toHaveBeenCalledWith(
        expect.objectContaining({ addedBy: 'mock-user-1' })
      );
    });

    it('editBoardgameAction should process and update as authenticated user', async () => {
      await editBoardgameAction('123', mockFormData);
      expect(db.updateBoardgame).toHaveBeenCalledWith('123',
        expect.objectContaining({ updatedBy: 'mock-user-1' })
      );
    });

    it('removeBoardgame should delete when authenticated', async () => {
      await removeBoardgame(mockFormData);
      expect(db.deleteBoardgame).toHaveBeenCalledWith('123');
    });
  });
});
