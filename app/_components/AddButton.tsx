'use client';

import { useRef, cloneElement, ReactElement } from 'react';

export default function AddButton({label, children}: {label: string, children: ReactElement}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <div className='fab'>
            <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>{label}</button>
        </div>
        {cloneElement(children as ReactElement<any>, { dialogRef })}
    </>
}
