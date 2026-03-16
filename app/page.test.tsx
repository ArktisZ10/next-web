import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Given the Home page component', () => {
  describe('When it is rendered', () => {
    it('Then it displays the landing page content', () => {
      // Given/When
      render(Home());

      // Then
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText(/Welcome to my website/)).toBeInTheDocument();
      expect(screen.getByText('ArktisZ10')).toBeInTheDocument();
    });
  });
});
