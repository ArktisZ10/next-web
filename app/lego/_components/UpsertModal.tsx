import { RefObject } from "react";
import { LegoEntity } from "@/db/collections/Lego";

interface UpsertModalProps {
    editObject?: LegoEntity,
    action: (formData: FormData) => void | Promise<void>
    dialogRef: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    return <dialog ref={dialogRef} className="modal overflow-auto">
        <form action={action}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="text-lg font-bold bg-base-200 rounded-xl px-2">{editObject ? "Edit Lego" : "New Lego"}</legend>
                
                <label className="label">Name</label>
                <input type="text" name="name" className="input" placeholder="Awesome Set" defaultValue={editObject?.name} required />
                
                <label className="label">Set Number</label>
                <input type="text" name="setNumber" className="input" placeholder="12345" defaultValue={editObject?.setNumber} />
                
                <label className="label">Theme</label>
                <input type="text" name="theme" className="input" placeholder="Star Wars" defaultValue={editObject?.theme} />
                
                <label className="label">Image URL</label>
                <input type="text" name="image" className="input" placeholder="https://example.com/image.jpg" defaultValue={editObject?.image} />
                
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title label px-1">Additional details</div>
                    <div className="collapse-content text-sm px-0">
                        <label className="label">Piece Count</label>
                        <input type="number" name="pieceCount" className="input" placeholder="500" defaultValue={editObject?.pieceCount} />
                        
                        <label className="label">Minifigures</label>
                        <input type="number" name="minifigures" className="input" placeholder="4" defaultValue={editObject?.minifigures}/>
                        
                        <label className="label">Year Released</label>
                        <input type="number" name="yearReleased" className="input" placeholder="2023" defaultValue={editObject?.yearReleased} />
                    </div>
                </div>
                
                <div className="modal-action">
                    <button type="button" className="btn btn-outline btn-primary" onClick={() => dialogRef.current?.close()}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={() => dialogRef.current?.close()}>Save</button>
                </div>
            </fieldset>
        </form>
    </dialog>
}