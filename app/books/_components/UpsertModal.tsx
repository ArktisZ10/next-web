"use client"
import { RefObject, useState } from "react";
import { BookEntity } from "@/db/collections/Book";
import AiSparkleButton from "@/app/_components/AiSparkleButton";
import { suggestBook } from "@/app/_actions/ai";

interface UpsertModalProps {
    editObject?: BookEntity,
    action: (formData: FormData) => void | Promise<void>
    dialogRef?: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    const [formData, setFormData] = useState({
        title: editObject?.title || "",
        author: editObject?.author || "",
        image: editObject?.image || "",
        isbn: editObject?.isbn || "",
        publisher: editObject?.publisher || "",
        yearPublished: editObject?.yearPublished || "",
        pages: editObject?.pages || ""
    });

    const [backupData, setBackupData] = useState<typeof formData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAiClick = async () => {
        setIsGenerating(true);
        try {
            const suggestion = await suggestBook({
                title: formData.title,
                author: formData.author,
                image: formData.image,
                isbn: formData.isbn,
                publisher: formData.publisher,
                yearPublished: formData.yearPublished ? Number(formData.yearPublished) : undefined,
                pages: formData.pages ? Number(formData.pages) : undefined,
            });
            setBackupData(formData);
            setFormData(prev => ({
                ...prev,
                title: suggestion.title || prev.title,
                author: suggestion.author || prev.author,
                image: suggestion.image || prev.image,
                isbn: suggestion.isbn || prev.isbn,
                publisher: suggestion.publisher || prev.publisher,
                yearPublished: suggestion.yearPublished ? Number(suggestion.yearPublished) : prev.yearPublished,
                pages: suggestion.pages ? Number(suggestion.pages) : prev.pages,
            }));
        } catch (error) {
            console.error("Failed to generate AI suggestions", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const revertAi = () => {
        if (backupData) {
            setFormData(backupData);
            setBackupData(null);
        }
    };

    const acceptAi = () => {
        setBackupData(null);
    };

    const closeAndReset = () => {
        setBackupData(null);
        dialogRef?.current?.close();
    }

    const hasData = Object.values(formData).some(val => val !== "" && val !== null && val !== undefined);

    return (
        <dialog ref={dialogRef} className="modal overflow-auto">
            <form action={action}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <div className="flex w-full mt-2 mb-4">
                        <legend className="text-lg font-bold bg-base-200 rounded-xl px-2 m-0 flex-1">{editObject ? "Edit Book" : "New Book"}</legend>
                        <AiSparkleButton onClick={handleAiClick} loading={isGenerating} disabled={!hasData} className="btn-circle btn-sm" title="AI Auto-Complete" />
                    </div>

                    {backupData && (
                        <div className="alert alert-info shadow-lg mb-4 text-sm flex flex-col gap-2 p-3">
                            <span>Review AI suggestions.</span>
                            <div className="flex-none gap-2 flex">
                                <button type="button" className="btn btn-sm btn-ghost" onClick={revertAi}>Revert</button>
                                <button type="button" className="btn btn-sm btn-primary" onClick={acceptAi}>Accept</button>
                            </div>
                        </div>
                    )}
                    
                    <label className="label">Title</label>
                    <input type="text" name="title" className="input" placeholder="Awesome Book" value={formData.title} onChange={handleChange} required />
                    
                    <label className="label">Author</label>
                    <input type="text" name="author" className="input" placeholder="John Doe" value={formData.author} onChange={handleChange} />
                    
                    <label className="label">Image URL</label>
                    <input type="text" name="image" className="input" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} />
                    
                    <div className="collapse collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title label px-1">Additional details</div>
                        <div className="collapse-content text-sm px-0 flex flex-col gap-2">
                            <div>
                                <label className="label">ISBN</label>
                                <input type="text" name="isbn" className="input w-full" placeholder="978-3-16-148410-0" value={formData.isbn} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Publisher</label>
                                <input type="text" name="publisher" className="input w-full" placeholder="Acme publishing" value={formData.publisher} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Year Published</label>
                                <input type="number" name="yearPublished" className="input w-full" placeholder="2023" value={formData.yearPublished} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Pages</label>
                                <input type="number" name="pages" className="input w-full" placeholder="300" value={formData.pages} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-action">
                        <button type="button" className="btn btn-outline btn-primary" onClick={closeAndReset}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={closeAndReset}>Save</button>
                    </div>
                </fieldset>
            </form>
        </dialog>
    )
}
