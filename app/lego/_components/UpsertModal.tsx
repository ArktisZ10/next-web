"use client"
import { RefObject, useState } from "react";
import { LegoEntity } from "@/db/collections/Lego";
import AiSparkleButton from "@/app/_components/AiSparkleButton";
import { suggestLego } from "@/app/_actions/ai";

interface UpsertModalProps {
    editObject?: LegoEntity,
    action: (formData: FormData) => void | Promise<void>
    dialogRef?: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    const [formData, setFormData] = useState({
        name: editObject?.name || "",
        setNumber: editObject?.setNumber || "",
        theme: editObject?.theme || "",
        image: editObject?.image || "",
        pieceCount: editObject?.pieceCount || "",
        minifigures: editObject?.minifigures || "",
        yearReleased: editObject?.yearReleased || ""
    });

    const [backupData, setBackupData] = useState<typeof formData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAiClick = async () => {
        setIsGenerating(true);
        try {
            const suggestion = await suggestLego({
                name: formData.name,
                setNumber: formData.setNumber,
                theme: formData.theme,
                image: formData.image,
                pieceCount: formData.pieceCount ? Number(formData.pieceCount) : undefined,
                minifigures: formData.minifigures ? Number(formData.minifigures) : undefined,
                yearReleased: formData.yearReleased ? Number(formData.yearReleased) : undefined,
            });
            setBackupData(formData);
            setFormData(prev => ({
                ...prev,
                name: suggestion.name || prev.name,
                setNumber: suggestion.setNumber || prev.setNumber,
                theme: suggestion.theme || prev.theme,
                image: suggestion.image || prev.image,
                pieceCount: suggestion.pieceCount ? Number(suggestion.pieceCount) : prev.pieceCount,
                minifigures: suggestion.minifigures ? Number(suggestion.minifigures) : prev.minifigures,
                yearReleased: suggestion.yearReleased ? Number(suggestion.yearReleased) : prev.yearReleased,
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
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-[90vw] max-w-sm border p-4">
                    <div className="flex w-full mt-2 mb-4">
                        <legend className="text-lg font-bold bg-base-200 rounded-xl px-2 m-0 flex-1">{editObject ? "Edit Lego" : "New Lego"}</legend>
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
                    
                    <label className="label">Name</label>
                    <input type="text" name="name" className="input w-full" placeholder="Awesome Set" value={formData.name} onChange={handleChange} required />
                    
                    <label className="label">Set Number</label>
                    <input type="text" name="setNumber" className="input w-full" placeholder="12345" value={formData.setNumber} onChange={handleChange} />
                    
                    <label className="label">Theme</label>
                    <input type="text" name="theme" className="input w-full" placeholder="Star Wars" value={formData.theme} onChange={handleChange} />
                    
                    <label className="label">Image URL</label>
                    <input type="text" name="image" className="input w-full" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} />
                    
                    <div className="collapse collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title label px-1">Additional details</div>
                        <div className="collapse-content text-sm px-0 flex flex-col gap-2">
                            <div>
                                <label className="label">Piece Count</label>
                                <input type="number" name="pieceCount" className="input w-full" placeholder="500" value={formData.pieceCount} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Minifigures</label>
                                <input type="number" name="minifigures" className="input w-full" placeholder="4" value={formData.minifigures} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Year Released</label>
                                <input type="number" name="yearReleased" className="input w-full" placeholder="2023" value={formData.yearReleased} onChange={handleChange} />
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
