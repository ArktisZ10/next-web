'use server';

import { insertBoardgame, updateBoardgame, deleteBoardgame, fromFormData } from "@/db/collections/Boardgame";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addBoardgameAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (!session?.user?.id) {
        throw new Error('User must be authenticated');
    }

    const boardgame = fromFormData(formData);

    await insertBoardgame({
        ...boardgame,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/boardgames');
}

export async function editBoardgameAction(id: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (!session?.user?.id) {
        throw new Error('User must be authenticated');
    }

    const boardgame = fromFormData(formData);

    await updateBoardgame(id, {
        ...boardgame,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/boardgames');
}

export async function removeBoardgame(formData: FormData) {
    const id = formData.get('id')?.toString();
    if (!id) {
        throw new Error('ID is required');
    }

    await deleteBoardgame(id);
    revalidatePath('/boardgames');
}