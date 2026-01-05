
const TableHeader = <tr>
    <td>Name</td>
    <td>Players</td>
    <td>Play Time</td>
    <td>Year Published</td>
</tr>

interface BoardGames {
    name: string;
    minPlayers: number;
    maxPlayers: number;
    minPlayTime: number;
    maxPlayTime: number;
    publisher?: string;
    yearPublished?: number;
}

const boardGames: BoardGames[] = [
    {
        name: "Catan",
        minPlayers: 3,
        maxPlayers: 4,
        minPlayTime: 60,
        maxPlayTime: 120,
        publisher: "Kosmos",
        yearPublished: 1995,
    },
    {
        name: "Pandemic",
        minPlayers: 2,
        maxPlayers: 4,
        minPlayTime: 45,
        maxPlayTime: 60,
        publisher: "Z-Man Games",
        yearPublished: 2008,
    },
    {
        name: "Ticket to Ride",
        minPlayers: 2,
        maxPlayers: 5,
        minPlayTime: 30,
        maxPlayTime: 60,
        publisher: "Days of Wonder",
        yearPublished: 2004,
    },
];

export default function BoardGames() {
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