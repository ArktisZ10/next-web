import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/db/client";
import { redirect } from "next/navigation";
import UserTable from "./_components/UserTable";
import type { UserRow } from "./_components/UserTable";

export const revalidate = 0;

export default async function AdminPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        redirect("/");
    }

    const db = await getDb();
    const rawUsers = await db.collection("user").find({}).toArray();

    const users: UserRow[] = rawUsers.map(u => ({
        id: u.id || u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role || "read-only",
        banned: u.banned === true,
    }));

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <UserTable users={users} />
        </div>
    );
}