import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'mock-geist-sans' }),
  Geist_Mono: () => ({ variable: 'mock-geist-mono' }),
}));

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
  }),
}));

// UserMenu and AdminDrawerLink can have complex auth hooks, better mock them
vi.mock('./_components/UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}));

vi.mock('./_components/AdminDrawerLink', () => ({
  AdminDrawerLink: () => <li data-testid="admin-link">Admin</li>,
}));

describe('Given the RootLayout component', () => {
  describe('When it is rendered', () => {
    it('Then it displays navigation links including Board Games, Books, and Lego', () => {
      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );
      
      expect(screen.getByText('Board Games')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Lego')).toBeInTheDocument();
    });
  });
});
