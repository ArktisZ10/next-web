import { RefObject } from "react";
import { BookEntity } from "@/db/collections/Book";

interface UpsertModalProps {
    editObject?: BookEntity,
    action: (formData: FormData) => void | Promise<void>
    dialogRef?: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    return <dialog ref={dialogRef} className="modal overflow-auto">
        <form action={action}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="text-lg font-bold bg-base-200 rounded-xl px-2">{editObject ? "Edit Book" : "New Book"}</legend>
                
                <label className="label">Title</label>
                <input type="text" name="title" className="input" placeholder="Awesome Book" defaultValue={editObject?.title} required />
                
                <label className="label">Author</label>
                <input type="text" name="author" className="input" placeholder="John Doe" defaultValue={editObject?.author} />
                
                <label className="label">Image URL</label>
                <input type="text" name="image" className="input" placeholder="https://example.com/image.jpg" defaultValue={editObject?.image} />
                
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title label px-1">Additional details</div>
                    <div className="collapse-content text-sm px-0">
                        <label className="label">ISBN</label>
                        <input type="text" name="isbn" className="input" placeholder="978-3-16-148410-0" defaultValue={editObject?.isbn} />
                        
                        <label className="label">Publisher</label>
                        <input type="text" name="publisher" className="input" placeholder="Acme publishing" defaultValue={editObject?.publisher}/>
                        
                        <label className="label">Year Published</label>
                        <input type="number" name="yearPublished" className="input" placeholder="2023" defaultValue={editObject?.yearPublished} />

                        <label className="label">Pages</label>
                        <input type="number" name="pages" className="input" placeholder="300" defaultValue={editObject?.pages} />
                    </div>
                </div>
                
                <div className="modal-action">
                    <button type="button" className="btn btn-outline btn-primary" onClick={() => dialogRef?.current?.close()}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={() => dialogRef?.current?.close()}>Save</button>
                </div>
            </fieldset>
        </form>
    </dialog>
}