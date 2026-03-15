import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/db/client";
import { redirect } from "next/navigation";
import RoleSelect from "./_components/RoleSelect";

export const revalidate = 0;

export default async function AdminPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        redirect("/");
    }

    const db = await getDb();
    const users = await db.collection("user").find({}).toArray();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full max-w-4xl">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id.toString()}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className="badge badge-ghost badge-sm">{u.role || "read-only"}</span></td>
                                <td>
                                    <RoleSelect userId={u.id || u._id.toString()} currentRole={u.role || "read-only"} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}