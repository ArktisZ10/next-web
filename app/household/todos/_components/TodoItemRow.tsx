"use client";

import { useTransition } from "react";
import { toggleItemAction, deleteItemAction } from "../_actions";
import type { TodoItemEntity } from "@/db/collections/TodoList";

interface Props {
    listId: string;
    item: TodoItemEntity;
}

export function TodoItemRow({ listId, item }: Props) {
    const [, startTransition] = useTransition();

    function handleToggle() {
        const data = new FormData();
        data.set("listId", listId);
        data.set("itemId", item.id);
        data.set("completed", (!item.completed).toString());
        startTransition(() => toggleItemAction(data));
    }

    return (
        <li className="flex items-center gap-3 py-2 border-b border-base-200 last:border-0">
            <input
                type="checkbox"
                className="checkbox checkbox-primary"
                defaultChecked={item.completed}
                aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
                onChange={handleToggle}
            />
            <span className={`flex-1 ${item.completed ? "line-through text-base-content/40" : ""}`}>
                {item.text}
            </span>
            <form action={deleteItemAction}>
                <input type="hidden" name="listId" value={listId} />
                <input type="hidden" name="itemId" value={item.id} />
                <button type="submit" className="btn btn-ghost btn-xs text-error" aria-label="Delete item">
                    ✕
                </button>
            </form>
        </li>
    );
}
