'use server';

import { insertBoardgame, updateBoardgame, deleteBoardgame, fromFormData } from "@/db/collections/Boardgame";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth-helpers";

export async function addBoardgameAction(formData: FormData) {
    const session = await requirePermission({ collection: ["create"] });

    const boardgame = fromFormData(formData);

    await insertBoardgame({
        ...boardgame,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/boardgames');
}

export async function editBoardgameAction(id: string, formData: FormData) {
    const session = await requirePermission({ collection: ["update"] });

    const boardgame = fromFormData(formData);

    await updateBoardgame(id, {
        ...boardgame,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/boardgames');
}

export async function removeBoardgame(formData: FormData) {
    await requirePermission({ collection: ["delete"] });

    const id = formData.get('id')?.toString();
    if (!id) {
        throw new Error('ID is required');
    }

    await deleteBoardgame(id);
    revalidatePath('/boardgames');
}
