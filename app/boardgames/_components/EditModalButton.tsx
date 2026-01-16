'use client';

import UpsertModal from "./UpsertModal";
import { BoardgameEntity } from "@/db/collections/Boardgame";
import { useRef } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { editBoardgameAction } from "../_actions";

export default function EditModalButton({editObject}: {editObject: BoardgameEntity}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <button className="btn btn-square btn-sm btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <PencilIcon />
        </button>
        <UpsertModal editObject={editObject} dialogRef={dialogRef} action={(formData) => editBoardgameAction(editObject.id!, formData)} />
    </>
}