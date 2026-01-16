'use server';

import { insertBoardgame, updateBoardgame, deleteBoardgame, fromFormData } from "@/db/collections/Boardgame";
import { revalidatePath } from "next/cache";

export async function addBoardgameAction(formData: FormData) {
    const boardgame = fromFormData(formData);

    await insertBoardgame(boardgame);
    revalidatePath('/boardgames');
}

export async function editBoardgameAction(id: string, formData: FormData) {
    const boardgame = fromFormData(formData);

    const updatedBoardgame = {
        ...boardgame,
        id: id,
    };
    
    await updateBoardgame(updatedBoardgame);
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