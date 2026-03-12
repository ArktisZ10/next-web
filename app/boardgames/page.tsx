import { getBoardgames } from "@/db/collections/Boardgame";
import AddModalButton from "./_components/AddModalButton";
import EditModalButton from "./_components/EditModalButton";
import RemoveButton from "./_components/DeleteButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const revalidate = 600;

const TableHeader = <tr>
    <td>Name</td>
    <td>Players</td>
    <td>Play Time</td>
    <td>Published</td>
    <td></td>
</tr>

export default async function BoardGamesPage() {
    const boardgames = await getBoardgames();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isAuthenticated = !!session?.user;

    return (
        <div className="p-8">
            {isAuthenticated && <AddModalButton />}
            <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                    {TableHeader}
                </thead>
                <tbody>
                    {boardgames.map((game, index) => (
                        <tr key={index} className="text-lg">
                            <td>{game.name}</td>
                            <td>{game.minPlayers && game.maxPlayers ? `${game.minPlayers} - ${game.maxPlayers}` : '-'}</td>
                            <td>{game.minPlayTime && game.maxPlayTime ? `${game.minPlayTime} - ${game.maxPlayTime} min` : '-'}</td>
                            <td>{[game.publisher, game.yearPublished].filter(Boolean).join(", ")}</td>
                            <td className="flex justify-end space-x-2">
                                {isAuthenticated && (
                                    <>
                                        <EditModalButton editObject={game} />
                                        <RemoveButton id={game.id!} />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    {TableHeader}
                </tfoot>
            </table>
        </div>
    );
}