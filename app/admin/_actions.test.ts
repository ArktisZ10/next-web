import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setRoleAction, banUserAction, unbanUserAction } from './_actions';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      setRole: vi.fn(),
      banUser: vi.fn(),
      unbanUser: vi.fn()
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers())
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT'); })
}));

describe('Admin Server Actions', () => {
  let formData: FormData;

  beforeEach(() => {
    vi.clearAllMocks();
    formData = new FormData();
  });

  describe('Given a request to change a user role via setRoleAction', () => {
    
    describe('When the user is not logged in', () => {
      it('Then it redirects (unauthenticated)', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue(null);

        // When
        const actionPromise = setRoleAction(formData);

        // Then
        await expect(actionPromise).rejects.toThrow('NEXT_REDIRECT');
      });
    });

    describe('When the logged-in user does not have the admin role', () => {
      it('Then it throws an Unauthorized error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'visitor' } } as any);

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
        formData.append('role', 'household');

        // When
        await setRoleAction(formData);

        // Then
        expect(auth.api.setRole).toHaveBeenCalledWith(expect.objectContaining({
          body: { userId: 'user-123', role: 'household' }
        }));
        expect(revalidatePath).toHaveBeenCalledWith('/admin');
      });
    });
  });

  describe('Given a request to ban a user via banUserAction', () => {

    describe('When the user is not logged in', () => {
      it('Then it redirects (unauthenticated)', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue(null);

        // When / Then
        await expect(banUserAction(formData)).rejects.toThrow('NEXT_REDIRECT');
      });
    });

    describe('When the logged-in user does not have the admin role', () => {
      it('Then it throws an Unauthorized error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'visitor' } } as any);

        // When / Then
        await expect(banUserAction(formData)).rejects.toThrow('Unauthorized');
      });
    });

    describe('When an admin user omits the userId parameter', () => {
      it('Then it throws a Missing parameters error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);

        // When / Then
        await expect(banUserAction(formData)).rejects.toThrow('Missing parameters');
      });
    });

    describe('When an admin user provides a valid userId', () => {
      it('Then it bans the user and revalidates the admin path', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
        formData.append('userId', 'user-123');

        // When
        await banUserAction(formData);

        // Then
        expect(auth.api.banUser).toHaveBeenCalledWith(expect.objectContaining({
          body: { userId: 'user-123' }
        }));
        expect(revalidatePath).toHaveBeenCalledWith('/admin');
      });
    });
  });

  describe('Given a request to unban a user via unbanUserAction', () => {

    describe('When the user is not logged in', () => {
      it('Then it redirects (unauthenticated)', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue(null);

        // When / Then
        await expect(unbanUserAction(formData)).rejects.toThrow('NEXT_REDIRECT');
      });
    });

    describe('When the logged-in user does not have the admin role', () => {
      it('Then it throws an Unauthorized error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'visitor' } } as any);

        // When / Then
        await expect(unbanUserAction(formData)).rejects.toThrow('Unauthorized');
      });
    });

    describe('When an admin user omits the userId parameter', () => {
      it('Then it throws a Missing parameters error', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);

        // When / Then
        await expect(unbanUserAction(formData)).rejects.toThrow('Missing parameters');
      });
    });

    describe('When an admin user provides a valid userId', () => {
      it('Then it unbans the user and revalidates the admin path', async () => {
        // Given
        vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
        formData.append('userId', 'user-123');

        // When
        await unbanUserAction(formData);

        // Then
        expect(auth.api.unbanUser).toHaveBeenCalledWith(expect.objectContaining({
          body: { userId: 'user-123' }
        }));
        expect(revalidatePath).toHaveBeenCalledWith('/admin');
      });
    });
  });
});

