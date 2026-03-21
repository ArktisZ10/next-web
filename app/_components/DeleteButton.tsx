import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteButton({ id, action }: { id: string, action: (formData: FormData) => void | Promise<void> }) {
    return <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="btn btn-square btn-sm btn-error">
            <TrashIcon className="w-5 h-5"/>
        </button>
    </form>
}
