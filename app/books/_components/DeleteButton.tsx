import { TrashIcon } from "@heroicons/react/24/outline";
import { removeBook } from "../_actions";

export default function DeleteButton({ id }: { id: string }) {
    return <form action={removeBook}>
        <input type="hidden" name="id" value={id} />
        <button className="btn btn-square btn-sm btn-error">
            <TrashIcon className="w-5 h-5"/>
        </button>
    </form>
}