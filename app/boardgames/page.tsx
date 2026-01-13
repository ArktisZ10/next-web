import { boardgames } from "@/db/entities/Boardgame";

export const revalidate = 600;

const TableHeader = <tr>
    <td>Name</td>
    <td>Players</td>
    <td>Play Time</td>
    <td>Year Published</td>
</tr>

export default async function BoardGamesPage() {
    const boardGames = await boardgames.find({}, { sort: { name: -1 } }).toArray();

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