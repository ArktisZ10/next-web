'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function setRoleAction(formData: FormData) {
    await assertAdmin();

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
    await assertAdmin();

    const userId = formData.get("userId")?.toString();

    if (!userId) {
        throw new Error("Missing parameters");
    }

    await auth.api.banUser({ body: { userId }, headers: await headers() });

    revalidatePath("/admin");
}

export async function unbanUserAction(formData: FormData) {
    await assertAdmin();

    const userId = formData.get("userId")?.toString();

    if (!userId) {
        throw new Error("Missing parameters");
    }

    await auth.api.unbanUser({ body: { userId }, headers: await headers() });

    revalidatePath("/admin");
}
