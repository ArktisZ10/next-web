'use client'

import { useRef } from 'react'
import { addLegoAction } from '../_actions';
import UpsertModal from './UpsertModal';

export default function AddModalButton() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <div className='fab'>
            <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>Add new lego</button>
        </div>
        <UpsertModal action={addLegoAction} dialogRef={dialogRef} />
    </>
}