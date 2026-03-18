"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    const handleSearch = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) {
                params.set("q", searchTerm);
            } else {
                params.delete("q");
            }
            router.push(`?${params.toString()}`);
        },
        [searchTerm, searchParams, router]
    );

    return (
        <form onSubmit={handleSearch} className="flex gap-2 items-center justify-center">
            <div className="join shadow-sm">
                <input
                    type="text"
                    placeholder="Search lego..."
                    className="input input-bordered join-item input-sm w-48 md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-sm join-item btn-primary">
                    Search
                </button>
            </div>
        </form>
    );
}