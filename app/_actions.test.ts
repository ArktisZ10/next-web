import { describe, it, expect, vi } from 'vitest';
import { setViewCookie } from './_actions';

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn()
  }))
}));

describe('Given the global App Server Actions', () => {
  describe('When setting a view cookie', () => {
    it('Then it writes the cookie to next/headers cookies with a 1 year maxAge', async () => {
      // Given
      const { cookies } = await import('next/headers');
      const mockSet = vi.fn();
      vi.mocked(cookies).mockResolvedValue({ set: mockSet } as any);

      // When
      await setViewCookie('testCookie', 'grid');

      // Then
      expect(mockSet).toHaveBeenCalledWith('testCookie', 'grid', {
        maxAge: 60 * 60 * 24 * 365
      });
    });
  });
});
