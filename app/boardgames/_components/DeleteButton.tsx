import { TrashIcon } from "@heroicons/react/24/outline";
import { removeBoardgame } from "../_actions";

export default function RemoveButton({ id }: { id: string }) {
    return <form action={removeBoardgame}>
        <input type="hidden" name="id" value={id} />
        <button className="btn btn-square btn-sm btn-error">
            <TrashIcon />
        </button>
    </form>
}