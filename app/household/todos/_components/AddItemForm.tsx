"use client";

import { useRef } from "react";
import { addItemAction } from "../_actions";

interface Props {
    listId: string;
}

export function AddItemForm({ listId }: Props) {
    const ref = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        await addItemAction(formData);
        ref.current?.reset();
    }

    return (
        <form ref={ref} action={handleSubmit} className="flex gap-2 mt-4">
            <input type="hidden" name="listId" value={listId} />
            <input
                name="text"
                type="text"
                placeholder="Add a new item…"
                required
                className="input input-bordered flex-1"
            />
            <button type="submit" className="btn btn-primary">
                Add
            </button>
        </form>
    );
}
