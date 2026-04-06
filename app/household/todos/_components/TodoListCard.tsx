"use client";

import Link from "next/link";
import { deleteListAction } from "../_actions";
import type { TodoListEntity } from "@/db/collections/TodoList";

interface Props {
    list: TodoListEntity;
}

export function TodoListCard({ list }: Props) {
    const total = list.items.length;
    const done = list.items.filter((i) => i.completed).length;

    return (
        <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
                <div className="flex items-center justify-between gap-2">
                    <Link href={`/household/todos/${list.id}`} className="card-title text-lg hover:underline flex-1">
                        {list.name}
                    </Link>
                    <form action={deleteListAction}>
                        <input type="hidden" name="listId" value={list.id} />
                        <button
                            type="submit"
                            className="btn btn-ghost btn-sm text-error"
                            aria-label="Delete list"
                            onClick={(e) => {
                                if (!confirm(`Delete "${list.name}"?`)) e.preventDefault();
                            }}
                        >
                            Delete
                        </button>
                    </form>
                </div>
                <p className="text-sm text-base-content/60">
                    {total === 0 ? "No items" : `${done}/${total} done`}
                </p>
            </div>
        </div>
    );
}
