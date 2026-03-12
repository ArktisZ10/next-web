import { describe, it, expect, vi, beforeEach } from 'vitest';
import BoardGamesPage from './page';
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

vi.mock('./_components/AddModalButton', () => ({ default: 'MockAddModalButton' }));
vi.mock('./_components/EditModalButton', () => ({ default: 'MockEditModalButton' }));
vi.mock('./_components/DeleteButton', () => ({ default: 'MockDeleteButton' }));

vi.mock('@/db/collections/Boardgame', () => ({
  getBoardgames: vi.fn()
}));

describe('BoardGamesPage Authentication Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.getBoardgames).mockResolvedValue([
      { id: '1', name: 'Test Game' } as any
    ]);
  });

  it('hides edit/delete/add controls when unauthenticated', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const page = await BoardGamesPage();
    // We stringify the react node tree to check for presence of mocked components
    const treeString = JSON.stringify(page);

    expect(treeString).toContain('Test Game'); // Ensure game renders
    expect(treeString).not.toContain('MockAddModalButton'); // Add button should be hidden
    expect(treeString).not.toContain('MockEditModalButton'); // Edit button should be hidden
    expect(treeString).not.toContain('MockDeleteButton'); // Delete button should be hidden
  });

  it('shows edit/delete/add controls when authenticated', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'mock-user-1' },
    } as any);

    const page = await BoardGamesPage();
    const treeString = JSON.stringify(page);

    expect(treeString).toContain('Test Game'); // Ensure game renders
    expect(treeString).toContain('MockAddModalButton'); // Add button should be visible
    expect(treeString).toContain('MockEditModalButton'); // Edit button should be visible
    expect(treeString).toContain('MockDeleteButton'); // Delete button should be visible
  });
});
