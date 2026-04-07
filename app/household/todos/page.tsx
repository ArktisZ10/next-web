import { redirect } from "next/navigation";
import { getTodoLists } from "@/db/collections/TodoList";
import { CreateListForm } from "./_components/CreateListForm";
import { TodoListCard } from "./_components/TodoListCard";
import { sessionHasPermission } from "@/lib/auth-helpers";

export const revalidate = 0;

export default async function HouseholdTodosPage() {
    const canAccess = await sessionHasPermission({ household: ["read"] });

    if (!canAccess) {
        redirect("/");
    }

    const lists = await getTodoLists();

    return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6">Todo Lists</h1>
            <CreateListForm />
            {lists.length === 0 ? (
                <p className="text-base-content/50 text-center py-12">No lists yet. Create one above.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {lists.map((list) => (
                        <TodoListCard key={list.id} list={list} />
                    ))}
                </div>
            )}
        </div>
    );
}
