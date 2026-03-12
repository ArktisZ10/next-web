import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home page', () => {
  it('renders landing page content', () => {
    const tree = JSON.stringify(Home());

    expect(tree).toContain('Hello there');
    expect(tree).toContain('Welcome to my website');
    expect(tree).toContain('ArktisZ10');
  });
});
