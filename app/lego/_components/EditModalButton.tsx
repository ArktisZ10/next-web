'use client';

import UpsertModal from "./UpsertModal";
import { LegoEntity } from "@/db/collections/Lego";
import { useRef } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { editLegoAction } from "../_actions";

export default function EditModalButton({editObject}: {editObject: LegoEntity}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <button className="btn btn-square btn-sm btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <PencilIcon className="w-5 h-5"/>
        </button>
        <UpsertModal editObject={editObject} dialogRef={dialogRef} action={(formData) => editLegoAction(editObject.id, formData)} />
    </>
}