import { RefObject } from "react";
import { BoardgameEntity } from "@/db/collections/Boardgame";

/**
 * Props for the UpsertModal component, which displays a dialog to create or edit a board game.
 *
 * @property editObject Optional existing BoardgameEntity; when provided, the form is pre-filled for editing.
 * @property action Form action handler that processes the submitted FormData, synchronously or asynchronously.
 * @property dialogRef Ref to the underlying HTMLDialogElement used to control opening and closing of the modal.
 */
interface UpsertModalProps {
    editObject?: BoardgameEntity,
    action: (formData: FormData) => void | Promise<void>
    dialogRef: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    return <dialog ref={dialogRef} className="modal overflow-auto">
                    <form action={action}>

                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="text-lg font-bold bg-base-200 rounded-xl px-2">{editObject ? "Edit Boardgame" : "New Boardgame"}</legend>
                    <label className="label">Title</label>
                    <input type="text" name="name" className="input" placeholder="Awesome game" defaultValue={editObject?.name} />

                    <label className="label">Players</label>
                    <div className="flex space-x-4">
                        <input type="number" name="players_min" className="input" placeholder="Min" defaultValue={editObject?.minPlayers} />
                        <input type="number" name="players_max" className="input" placeholder="Max" defaultValue={editObject?.maxPlayers} />
                    </div>


                    <label className="label">Playtime</label>
                    <div className="flex space-x-4">
                        <input type="number" name="playtime_min" className="input" placeholder="Min" defaultValue={editObject?.minPlayTime} />
                        <input type="number" name="playtime_max" className="input" placeholder="Max" defaultValue={editObject?.maxPlayTime} />
                    </div>

                    <div className="collapse collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title label px-1">Additional details</div>
                        <div className="collapse-content text-sm px-0">
                            <label className="label">Publisher</label>
                            <input type="text" name="publisher" className="input" placeholder="Spel AB" defaultValue={editObject?.publisher}/>

                            <label className="label">Year Published</label>
                            <input type="number" name="year_published" className="input" placeholder="2023" defaultValue={editObject?.yearPublished} />
                        </div>
                    </div>
                    
                    <div className="modal-action">
                        <button type="button" className="btn btn-outline btn-primary" onClick={() => dialogRef.current?.close()}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" onClick={() => dialogRef.current?.close()}>Save</button>
                    </div>
                </fieldset>
            </form>
        </dialog>
}