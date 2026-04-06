import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DrawerLink } from "./DrawerLink";

export async function HouseholdDrawerLink() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        return null;
    }

    return (
        <>
            <li className="menu-title mt-2">Household</li>
            <li>
                <DrawerLink href="/household/todos">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    Todos
                </DrawerLink>
            </li>
        </>
    );
}
