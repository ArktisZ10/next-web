'use server';

import { insertLego, updateLego, deleteLego, fromFormData } from "@/db/collections/Lego";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth-helpers";

export async function addLegoAction(formData: FormData) {
    const session = await requirePermission({ collection: ["create"] });

    const item = fromFormData(formData);

    await insertLego({
        ...item,
        addedBy: session.user.id,
        addedAt: new Date(),
    });
    revalidatePath('/lego');
}

export async function editLegoAction(id: string, formData: FormData) {
    const session = await requirePermission({ collection: ["update"] });

    const item = fromFormData(formData);

    await updateLego(id, {
        ...item,
        updatedBy: session.user.id,
        updatedAt: new Date(),
    });
    revalidatePath('/lego');
}

export async function removeLego(formData: FormData) {
    await requirePermission({ collection: ["delete"] });

    const id = formData.get('id')?.toString();
    if (!id) {
        throw new Error('ID is required');
    }

    await deleteLego(id);
    revalidatePath('/lego');
}
