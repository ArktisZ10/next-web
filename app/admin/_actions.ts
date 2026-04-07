'use server';

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function setRoleAction(formData: FormData) {
    await requireAdmin();

    const userId = formData.get("userId")?.toString();
    const role = formData.get("role")?.toString();

    if (!userId || !role) {
        throw new Error("Missing parameters");
    }

    // @ts-expect-error type infer issue with the setRole method
    await auth.api.setRole({ body: { userId, role }, headers: await headers() });

    revalidatePath("/admin");
}

export async function banUserAction(formData: FormData) {
    await requireAdmin();

    const userId = formData.get("userId")?.toString();

    if (!userId) {
        throw new Error("Missing parameters");
    }

    await auth.api.banUser({ body: { userId }, headers: await headers() });

    revalidatePath("/admin");
}

export async function unbanUserAction(formData: FormData) {
    await requireAdmin();

    const userId = formData.get("userId")?.toString();

    if (!userId) {
        throw new Error("Missing parameters");
    }

    await auth.api.unbanUser({ body: { userId }, headers: await headers() });

    revalidatePath("/admin");
}
