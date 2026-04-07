'use server';

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth-helpers";
import {
    createTodoList,
    deleteTodoList,
    addTodoItem,
    toggleTodoItem,
    deleteTodoItem,
} from "@/db/collections/TodoList";

export async function createListAction(formData: FormData) {
    const session = await requirePermission({ household: ["create"] });

    const name = formData.get("name")?.toString().trim();
    if (!name) throw new Error("Name is required");

    await createTodoList(name, session.user.name ?? session.user.email);
    revalidatePath("/household/todos");
}

export async function deleteListAction(formData: FormData) {
    await requirePermission({ household: ["delete"] });

    const listId = formData.get("listId")?.toString();
    if (!listId) throw new Error("Missing listId");

    await deleteTodoList(listId);
    revalidatePath("/household/todos");
}

export async function addItemAction(formData: FormData) {
    await requirePermission({ household: ["create"] });

    const listId = formData.get("listId")?.toString();
    const text = formData.get("text")?.toString().trim();
    if (!listId || !text) throw new Error("Missing parameters");

    await addTodoItem(listId, text);
    revalidatePath(`/household/todos/${listId}`);
}

export async function toggleItemAction(formData: FormData) {
    await requirePermission({ household: ["update"] });

    const listId = formData.get("listId")?.toString();
    const itemId = formData.get("itemId")?.toString();
    const completed = formData.get("completed") === "true";
    if (!listId || !itemId) throw new Error("Missing parameters");

    await toggleTodoItem(listId, itemId, completed);
    revalidatePath(`/household/todos/${listId}`);
}

export async function deleteItemAction(formData: FormData) {
    await requirePermission({ household: ["delete"] });

    const listId = formData.get("listId")?.toString();
    const itemId = formData.get("itemId")?.toString();
    if (!listId || !itemId) throw new Error("Missing parameters");

    await deleteTodoItem(listId, itemId);
    revalidatePath(`/household/todos/${listId}`);
}
