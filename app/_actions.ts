'use server';

import { cookies } from "next/headers";

export async function setViewCookie(cookieName: string, view: 'table' | 'grid') {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, view, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
}
