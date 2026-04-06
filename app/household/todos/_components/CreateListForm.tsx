"use client";

import { useRef } from "react";
import { createListAction } from "../_actions";

export function CreateListForm() {
    const ref = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        await createListAction(formData);
        ref.current?.reset();
    }

    return (
        <form ref={ref} action={handleSubmit} className="flex gap-2 mb-6">
            <input
                name="name"
                type="text"
                placeholder="New list name…"
                required
                className="input input-bordered flex-1"
            />
            <button type="submit" className="btn btn-primary">
                Create
            </button>
        </form>
    );
}
