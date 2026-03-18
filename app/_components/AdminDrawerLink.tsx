import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DrawerLink } from "./DrawerLink";

export async function AdminDrawerLink() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        return null;
    }

    return (
        <>
            <li className="menu-title mt-2">Administration</li>
            <li>
                <DrawerLink href="/admin">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Users (Admin)
                </DrawerLink>
            </li>
        </>
    );
}