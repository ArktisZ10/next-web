'use server';

import { insertLego, updateLego, deleteLego, fromFormData } from "@/db/collections/Lego";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addLegoAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'write') {
        throw new Error('User must have write access');
    }

    const item = fromFormData(formData);

    await insertLego({
        ...item,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/lego');
}

export async function editLegoAction(id: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'write') {
        throw new Error('User must have write access');
    }

    const item = fromFormData(formData);

    await updateLego(id, {
        ...item,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/lego');
}

export async function removeLego(formData: FormData) {
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

    await deleteLego(id);
    revalidatePath('/lego');
}