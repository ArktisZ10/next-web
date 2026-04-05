'use client';

import { useRef, cloneElement, ReactElement } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";

export default function EditButton({children}: {children: ReactElement}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <button className="btn btn-square btn-sm btn-primary" onClick={() => dialogRef.current?.showModal()}>
            <PencilIcon className="w-5 h-5" />
        </button>
        {cloneElement(children as ReactElement<any>, { dialogRef })}
    </>
}
