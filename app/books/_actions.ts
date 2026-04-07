'use server';

import { insertBook, updateBook, deleteBook, fromFormData } from "@/db/collections/Book";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth-helpers";

export async function addBookAction(formData: FormData) {
    const session = await requirePermission({ collection: ["create"] });

    const item = fromFormData(formData);

    await insertBook({
        ...item,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/books');
}

export async function editBookAction(id: string, formData: FormData) {
    const session = await requirePermission({ collection: ["update"] });

    const item = fromFormData(formData);

    await updateBook(id, {
        ...item,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/books');
}

export async function removeBook(formData: FormData) {
    await requirePermission({ collection: ["delete"] });

    const id = formData.get('id')?.toString();
    if (!id) {
        throw new Error('ID is required');
    }

    await deleteBook(id);
    revalidatePath('/books');
}
