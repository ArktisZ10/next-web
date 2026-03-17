'use client'

import { useRef } from 'react'
import { addBoardgameAction } from '../_actions';
import UpsertModal from './UpsertModal';

export default function AddButtonModal() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    return <>
        <div className='fab'>
            <button className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>Add new board game</button>
        </div>
        <UpsertModal action={addBoardgameAction} dialogRef={dialogRef} />
    </>
}