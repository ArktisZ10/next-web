import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getTodoList } from "@/db/collections/TodoList";
import { AddItemForm } from "../_components/AddItemForm";
import { TodoItemRow } from "../_components/TodoItemRow";
import { sessionHasPermission } from "@/lib/auth-helpers";

export const revalidate = 0;

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TodoListDetailPage({ params }: Props) {
    const canAccess = await sessionHasPermission({ household: ["read"] });

    if (!canAccess) {
        redirect("/");
    }

    const { id } = await params;
    const list = await getTodoList(id);
    if (!list) notFound();

    const pending = list.items.filter((i) => !i.completed);
    const completed = list.items.filter((i) => i.completed);

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full">
            <Link href="/household/todos" className="btn btn-ghost btn-sm mb-4">
                ← Back to lists
            </Link>
            <h1 className="text-2xl font-bold mb-2">{list.name}</h1>
            <p className="text-sm text-base-content/50 mb-6">
                {list.items.length === 0
                    ? "No items"
                    : `${completed.length}/${list.items.length} done`}
            </p>

            <AddItemForm listId={list.id} />

            {list.items.length === 0 ? (
                <p className="text-base-content/50 text-center py-12">No items yet.</p>
            ) : (
                <ul className="mt-6">
                    {pending.map((item) => (
                        <TodoItemRow key={item.id} listId={list.id} item={item} />
                    ))}
                    {completed.length > 0 && pending.length > 0 && (
                        <li className="py-2 text-xs font-semibold text-base-content/40 uppercase tracking-wide">
                            Completed
                        </li>
                    )}
                    {completed.map((item) => (
                        <TodoItemRow key={item.id} listId={list.id} item={item} />
                    ))}
                </ul>
            )}
        </div>
    );
}
