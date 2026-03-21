"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, ReactNode } from "react";

export default function SearchForm({ placeholder, children }: { placeholder: string, children?: ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const params = new URLSearchParams(searchParams.toString());
            
            for (const [key, value] of formData.entries()) {
                const strValue = value.toString().trim();
                if (strValue) {
                    params.set(key, strValue);
                } else {
                    params.delete(key);
                }
            }
            router.push(`?${params.toString()}`);
        },
        [searchParams, router]
    );

    return (
        <form onSubmit={handleSearch} className="flex gap-2 items-center justify-center">
            <div className="join shadow-sm">
                <input
                    type="text"
                    name="q"
                    placeholder={placeholder}
                    className="input input-bordered join-item input-sm w-48 md:w-64"
                    defaultValue={searchParams.get("q") || ""}
                />
                <button type="submit" className="btn btn-sm join-item btn-primary">
                    Search
                </button>
            </div>
            {children}
        </form>
    );
}
