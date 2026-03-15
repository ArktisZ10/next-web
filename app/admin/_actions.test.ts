import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setRoleAction } from './_actions';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      setRole: vi.fn()
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers())
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Admin Server Actions', () => {
  let formData: FormData;

  beforeEach(() => {
    vi.clearAllMocks();
    formData = new FormData();
  });

  describe('Given a request to change a user role via setRoleAction', () => {
    
    describe('When the user is not logged in', () => {
      it('Then it throws an Unauthorized error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue(null);

        // When
        const actionPromise = setRoleAction(formData);

        // Then
        await expect(actionPromise).rejects.toThrow('Unauthorized');
      });
    });

    describe('When the logged-in user does not have the admin role', () => {
      it('Then it throws an Unauthorized error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'write' } } as any);

        // When
        const actionPromise = setRoleAction(formData);

        // Then
        await expect(actionPromise).rejects.toThrow('Unauthorized');
      });
    });

    describe('When an admin user omits required form data parameters', () => {
      it('Then it throws a Missing parameters error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
        
        // When (completely empty formData)
        const emptyFormPromise = setRoleAction(formData);
        
        // Then
        await expect(emptyFormPromise).rejects.toThrow('Missing parameters');

        // Given (missing role parameter)
        formData.append('userId', '123');
        
        // When
        const partialFormPromise = setRoleAction(formData);

        // Then
        await expect(partialFormPromise).rejects.toThrow('Missing parameters');
      });
    });

    describe('When an admin user provides valid parameters', () => {
      it('Then it successfully sets the role and revalidates the admin path', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
        formData.append('userId', 'user-123');
        formData.append('role', 'write');

        // When
        await setRoleAction(formData);

        // Then
        expect(auth.api.setRole).toHaveBeenCalledWith(expect.objectContaining({
          body: { userId: 'user-123', role: 'write' }
        }));
        expect(revalidatePath).toHaveBeenCalledWith('/admin');
      });
    });
  });
});
