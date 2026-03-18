'use client'

import { useRef } from 'react'
import { addBookAction } from '../_actions';
import UpsertModal from './UpsertModal';

export default function AddModalButton() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <div className='fab'>
            <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>Add new book</button>
        </div>
        <UpsertModal action={addBookAction} dialogRef={dialogRef} />
    </>
}