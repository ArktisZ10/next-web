'use client';
import { useTransition } from "react";
import { setRoleAction } from "../_actions";

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("role", e.target.value);
        startTransition(() => {
            setRoleAction(formData);
        });
    };

    return (
        <select 
            name="role" 
            defaultValue={currentRole} 
            onChange={handleChange}
            className="select select-bordered select-sm w-full max-w-xs" 
            disabled={isPending}
        >
            <option value="admin">Admin</option>
            <option value="write">Write</option>
            <option value="read-only">Read Only</option>
        </select>
    );
}
