"use client"
import { RefObject, useState } from "react";
import { BoardgameEntity } from "@/db/collections/Boardgame";
import AiSparkleButton from "@/app/_components/AiSparkleButton";
import { suggestBoardgame } from "@/app/_actions/ai";

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
    dialogRef?: RefObject<HTMLDialogElement | null>
}

export default function UpsertModal({editObject, action, dialogRef}: UpsertModalProps) {
    const [formData, setFormData] = useState({
        name: editObject?.name || "",
        image: editObject?.image || "",
        players_min: editObject?.minPlayers || "",
        players_max: editObject?.maxPlayers || "",
        playtime_min: editObject?.minPlayTime || "",
        playtime_max: editObject?.maxPlayTime || "",
        publisher: editObject?.publisher || "",
        year_published: editObject?.yearPublished || ""
    });

    const [backupData, setBackupData] = useState<typeof formData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAiClick = async () => {
        setIsGenerating(true);
        try {
            const suggestion = await suggestBoardgame({
                name: formData.name,
                image: formData.image,
                minPlayers: formData.players_min ? Number(formData.players_min) : undefined,
                maxPlayers: formData.players_max ? Number(formData.players_max) : undefined,
                minPlayTime: formData.playtime_min ? Number(formData.playtime_min) : undefined,
                maxPlayTime: formData.playtime_max ? Number(formData.playtime_max) : undefined,
                publisher: formData.publisher,
                yearPublished: formData.year_published ? Number(formData.year_published) : undefined,
            });
            setBackupData(formData);
            setFormData(prev => ({
                ...prev,
                name: suggestion.name || prev.name,
                image: suggestion.image || prev.image,
                players_min: suggestion.minPlayers ? String(suggestion.minPlayers) : prev.players_min,
                players_max: suggestion.maxPlayers ? String(suggestion.maxPlayers) : prev.players_max,
                playtime_min: suggestion.minPlayTime ? String(suggestion.minPlayTime) : prev.playtime_min,
                playtime_max: suggestion.maxPlayTime ? String(suggestion.maxPlayTime) : prev.playtime_max,
                publisher: suggestion.publisher || prev.publisher,
                year_published: suggestion.yearPublished ? String(suggestion.yearPublished) : prev.year_published,
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
                        <legend className="text-lg font-bold bg-base-200 rounded-xl px-2 m-0 flex-1">{editObject ? "Edit Board Game" : "New Board Game"}</legend>
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
                    <input type="text" name="name" className="input w-full" placeholder="Awesome game" value={formData.name} onChange={handleChange} required />
                    
                    <label className="label">Image URL</label>
                    <input type="text" name="image" className="input w-full" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} />
                    
                    <label className="label">Players</label>
                    <div className="flex space-x-4">
                        <input type="number" name="players_min" className="input w-full" placeholder="Min" value={formData.players_min} onChange={handleChange} />
                        <input type="number" name="players_max" className="input w-full" placeholder="Max" value={formData.players_max} onChange={handleChange} />
                    </div>

                    <label className="label">Playtime</label>
                    <div className="flex space-x-4">
                        <input type="number" name="playtime_min" className="input w-full" placeholder="Min" value={formData.playtime_min} onChange={handleChange} />
                        <input type="number" name="playtime_max" className="input w-full" placeholder="Max" value={formData.playtime_max} onChange={handleChange} />
                    </div>

                    <div className="collapse collapse-arrow">
                        <input type="checkbox" />
                        <div className="collapse-title label px-1">Additional details</div>
                        <div className="collapse-content text-sm px-0 flex flex-col gap-2">
                            <div>
                                <label className="label">Publisher</label>
                                <input type="text" name="publisher" className="input w-full" placeholder="Spel AB" value={formData.publisher} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="label">Year Published</label>
                                <input type="number" name="year_published" className="input w-full" placeholder="2023" value={formData.year_published} onChange={handleChange} />
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
