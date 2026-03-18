'use client';

import UpsertModal from "./UpsertModal";
import { BookEntity } from "@/db/collections/Book";
import { useRef } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { editBookAction } from "../_actions";

export default function EditModalButton({editObject}: {editObject: BookEntity}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <button className="btn btn-square btn-sm btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <PencilIcon />
        </button>
        <UpsertModal editObject={editObject} dialogRef={dialogRef} action={(formData) => editBookAction(editObject.id, formData)} />
    </>
}