'use server';

import { insertBook, updateBook, deleteBook, fromFormData } from "@/db/collections/Book";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addBookAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'write') {
        throw new Error('User must have write access');
    }

    const item = fromFormData(formData);

    await insertBook({
        ...item,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/books');
}

export async function editBookAction(id: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'write') {
        throw new Error('User must have write access');
    }

    const item = fromFormData(formData);

    await updateBook(id, {
        ...item,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/books');
}

export async function removeBook(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'write') {
        throw new Error('User must have write access');
    }

    const id = formData.get('id')?.toString();
    if (!id) {
        throw new Error('ID is required');
    }

    await deleteBook(id);
    revalidatePath('/books');
}
