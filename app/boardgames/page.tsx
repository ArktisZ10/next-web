import { getEm } from "@/db/client";
import { type Boardgame } from "@/db/entities/Boardgame";

const TableHeader = <tr>
    <td>Name</td>
    <td>Players</td>
    <td>Play Time</td>
    <td>Year Published</td>
</tr>

export default async function BoardGamesPage() {
    const em = await getEm();
    const boardGames = await em.find<Boardgame>("Boardgame", {}, { orderBy: { name: 'desc' } });

    return (
        <div className="p-8">
            <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                    {TableHeader}
                </thead>
                <tbody>
                    {boardGames.map((game, index) => (
                        <tr key={index} className="text-lg">
                            <td>{game.name}</td>
                            <td>{game.minPlayers} - {game.maxPlayers}</td>
                            <td>{game.minPlayTime} - {game.maxPlayTime} min</td>
                            <td>{game.yearPublished ?? "-"}</td>
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