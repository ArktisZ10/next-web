'use client';

import { useState, useTransition } from "react";
import RoleSelect from "./RoleSelect";
import { banUserAction, unbanUserAction } from "../_actions";

export interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
}

const ROLES = ["all", "admin", "write", "read-only"] as const;

export default function UserTable({ users }: { users: UserRow[] }) {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [pendingId, startTransition] = useTransition();

    const filtered = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    function handleBan(userId: string, banned: boolean) {
        const formData = new FormData();
        formData.append("userId", userId);
        startTransition(() => {
            if (banned) {
                unbanUserAction(formData);
            } else {
                banUserAction(formData);
            }
        });
    }

    return (
        <div>
            {/* Search & filter controls */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input input-bordered input-sm w-full sm:max-w-xs"
                />
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="select select-bordered select-sm w-full sm:max-w-xs"
                >
                    {ROLES.map(r => (
                        <option key={r} value={r}>
                            {r === "all" ? "All roles" : r}
                        </option>
                    ))}
                </select>
            </div>

            {/* Mobile: card list */}
            <div className="flex flex-col gap-3 md:hidden">
                {filtered.map(u => (
                    <div key={u.id} className="card card-border bg-base-100 p-4 gap-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{u.name}</span>
                            {u.banned && <span className="badge badge-error badge-sm">banned</span>}
                        </div>
                        <span className="text-sm text-base-content/60">{u.email}</span>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <RoleSelect
                                userId={u.id}
                                currentRole={u.role}
                                isAdmin={u.role === "admin"}
                            />
                            {u.role !== "admin" && (
                                <button
                                    className={`btn btn-xs ${u.banned ? "btn-success" : "btn-error"}`}
                                    onClick={() => handleBan(u.id, u.banned)}
                                    disabled={pendingId}
                                >
                                    {u.banned ? "Unban" : "Ban"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-base-content/50 py-4">No users found.</p>
                )}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table w-full max-w-4xl">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    {u.banned
                                        ? <span className="badge badge-error badge-sm">banned</span>
                                        : <span className="badge badge-success badge-sm">active</span>
                                    }
                                </td>
                                <td>
                                    <RoleSelect
                                        userId={u.id}
                                        currentRole={u.role}
                                        isAdmin={u.role === "admin"}
                                    />
                                </td>
                                <td>
                                    {u.role !== "admin" && (
                                        <button
                                            className={`btn btn-xs ${u.banned ? "btn-success" : "btn-error"}`}
                                            onClick={() => handleBan(u.id, u.banned)}
                                            disabled={pendingId}
                                        >
                                            {u.banned ? "Unban" : "Ban"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-base-content/50 py-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
