'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setRoleAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const userId = formData.get("userId")?.toString();
    const role = formData.get("role")?.toString();

    if (!userId || !role) {
        throw new Error("Missing parameters");
    }

    // @ts-expect-error type infer issue with the setRole method
    await auth.api.setRole({ body: { userId, role }, headers: await headers() });

    revalidatePath("/admin");
}
