import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createListAction,
    deleteListAction,
    addItemAction,
    toggleItemAction,
    deleteItemAction,
} from './_actions';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import * as TodoListDb from '@/db/collections/TodoList';

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        },
    },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn(() => new Headers()),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT'); })
}));

vi.mock('@/db/collections/TodoList', () => ({
    createTodoList: vi.fn(),
    deleteTodoList: vi.fn(),
    addTodoItem: vi.fn(),
    toggleTodoItem: vi.fn(),
    deleteTodoItem: vi.fn(),
}));

describe('Household Todo Server Actions', () => {
    let formData: FormData;

    beforeEach(() => {
        vi.clearAllMocks();
        formData = new FormData();
    });

    describe('Given a request to create a list via createListAction', () => {
        describe('When the user is not logged in', () => {
            it('Then it redirects (unauthenticated)', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue(null);
                formData.append('name', 'Shopping');

                // When / Then
                await expect(createListAction(formData)).rejects.toThrow('NEXT_REDIRECT');
            });
        });

        describe('When the logged-in user does not have the admin role', () => {
            it('Then it throws an Unauthorized error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'visitor', name: 'Bob' } } as any);
                formData.append('name', 'Shopping');

                // When / Then
                await expect(createListAction(formData)).rejects.toThrow('Unauthorized');
            });
        });

        describe('When an admin omits the name parameter', () => {
            it('Then it throws a Name is required error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin', name: 'Admin' } } as any);

                // When / Then
                await expect(createListAction(formData)).rejects.toThrow('Name is required');
            });
        });

        describe('When an admin provides a valid name', () => {
            it('Then it creates the list and revalidates the todos path', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin', name: 'Admin', email: 'a@b.com' } } as any);
                vi.mocked(TodoListDb.createTodoList).mockResolvedValue({ id: 'list-1', name: 'Shopping', items: [] } as any);
                formData.append('name', 'Shopping');

                // When
                await createListAction(formData);

                // Then
                expect(TodoListDb.createTodoList).toHaveBeenCalledWith('Shopping', 'Admin');
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos');
            });
        });

        describe('When a household user provides a valid name', () => {
            it('Then it creates the list and revalidates the todos path', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'household', name: 'Alice', email: 'alice@example.com' } } as any);
                vi.mocked(TodoListDb.createTodoList).mockResolvedValue({ id: 'list-2', name: 'Groceries', items: [] } as any);
                formData.append('name', 'Groceries');

                // When
                await createListAction(formData);

                // Then
                expect(TodoListDb.createTodoList).toHaveBeenCalledWith('Groceries', 'Alice');
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos');
            });
        });
    });

    describe('Given a request to delete a list via deleteListAction', () => {
        describe('When the user is not logged in', () => {
            it('Then it redirects (unauthenticated)', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue(null);

                // When / Then
                await expect(deleteListAction(formData)).rejects.toThrow('NEXT_REDIRECT');
            });
        });

        describe('When the listId is missing', () => {
            it('Then it throws a Missing listId error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);

                // When / Then
                await expect(deleteListAction(formData)).rejects.toThrow('Missing listId');
            });
        });

        describe('When an admin provides a valid listId', () => {
            it('Then it deletes the list and revalidates', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
                vi.mocked(TodoListDb.deleteTodoList).mockResolvedValue(undefined);
                formData.append('listId', 'list-1');

                // When
                await deleteListAction(formData);

                // Then
                expect(TodoListDb.deleteTodoList).toHaveBeenCalledWith('list-1');
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos');
            });
        });
    });

    describe('Given a request to add an item via addItemAction', () => {
        describe('When the user is not an admin', () => {
            it('Then it throws an Unauthorized error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue(null);

                // When / Then
                await expect(addItemAction(formData)).rejects.toThrow('NEXT_REDIRECT');
            });
        });

        describe('When parameters are missing', () => {
            it('Then it throws a Missing parameters error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);

                // When / Then
                await expect(addItemAction(formData)).rejects.toThrow('Missing parameters');
            });
        });

        describe('When an admin provides valid parameters', () => {
            it('Then it adds the item and revalidates the list path', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
                vi.mocked(TodoListDb.addTodoItem).mockResolvedValue({} as any);
                formData.append('listId', 'list-1');
                formData.append('text', 'Buy milk');

                // When
                await addItemAction(formData);

                // Then
                expect(TodoListDb.addTodoItem).toHaveBeenCalledWith('list-1', 'Buy milk');
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos/list-1');
            });
        });
    });

    describe('Given a request to toggle an item via toggleItemAction', () => {
        describe('When the user is not an admin', () => {
            it('Then it throws an Unauthorized error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue(null);

                // When / Then
                await expect(toggleItemAction(formData)).rejects.toThrow('NEXT_REDIRECT');
            });
        });

        describe('When an admin provides valid parameters', () => {
            it('Then it toggles the item and revalidates', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
                vi.mocked(TodoListDb.toggleTodoItem).mockResolvedValue(undefined);
                formData.append('listId', 'list-1');
                formData.append('itemId', 'item-1');
                formData.append('completed', 'true');

                // When
                await toggleItemAction(formData);

                // Then
                expect(TodoListDb.toggleTodoItem).toHaveBeenCalledWith('list-1', 'item-1', true);
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos/list-1');
            });
        });
    });

    describe('Given a request to delete an item via deleteItemAction', () => {
        describe('When the user is not an admin', () => {
            it('Then it throws an Unauthorized error', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue(null);

                // When / Then
                await expect(deleteItemAction(formData)).rejects.toThrow('NEXT_REDIRECT');
            });
        });

        describe('When an admin provides valid parameters', () => {
            it('Then it deletes the item and revalidates', async () => {
                // Given
                vi.mocked(auth.api.getSession).mockResolvedValue({ user: { role: 'admin' } } as any);
                vi.mocked(TodoListDb.deleteTodoItem).mockResolvedValue(undefined);
                formData.append('listId', 'list-1');
                formData.append('itemId', 'item-1');

                // When
                await deleteItemAction(formData);

                // Then
                expect(TodoListDb.deleteTodoItem).toHaveBeenCalledWith('list-1', 'item-1');
                expect(revalidatePath).toHaveBeenCalledWith('/household/todos/list-1');
            });
        });
    });
});
