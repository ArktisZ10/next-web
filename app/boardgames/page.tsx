import { getBoardgames } from "@/db/collections/Boardgame";
import UpsertModal from "./_components/UpsertModal";
import { addBoardgameAction, editBoardgameAction, removeBoardgame } from "./_actions";
import AddButton from "../_components/AddButton";
import EditButton from "../_components/EditButton";
import DeleteButton from "../_components/DeleteButton";
import ViewToggle from "../_components/ViewToggle";
import CollectionView from "../_components/CollectionView";
import SearchForm from "./_components/SearchForm";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export const revalidate = 600;

const TableHeader = <tr>
    <td>Image</td>
    <td>Name</td>
    <td>Players</td>
    <td>Play Time</td>
    <td>Published</td>
    <td></td>
</tr>

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function BoardGamesPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const search = searchParams.q as string | undefined;
    const players = searchParams.players ? parseInt(searchParams.players as string, 10) : undefined;
    const playtime = searchParams.playtime ? parseInt(searchParams.playtime as string, 10) : undefined;

    const boardgames = await getBoardgames({ 
        search, 
        players: players && !isNaN(players) ? players : undefined, 
        playtime: playtime && !isNaN(playtime) ? playtime : undefined 
    });
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList,
    });
    
    const cookieStore = await cookies();
    const currentView = cookieStore.get('boardgameView')?.value || 'table';

    const hasWriteAccess = session?.user?.role === 'admin' || session?.user?.role === 'write';

    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center w-full gap-4">
                    <div className="flex-none flex items-center gap-4">
                        <h1 className="text-3xl font-bold">Board Games</h1>
                        {hasWriteAccess && <AddButton label="Add new board game"><UpsertModal action={addBoardgameAction} /></AddButton>}
                    </div>
                    <div className="grow flex justify-end">
                        <SearchForm />
                    </div>
                    <div className="flex-none">
                        <ViewToggle currentView={currentView} cookieName="boardgameView" />
                    </div>
                </div>
            </div>
            
            <CollectionView
                items={boardgames}
                view={currentView}
                tableHeaders={TableHeader}
                renderCard={(game, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
                        {game.image ? (
                            <figure>
                                <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                            </figure>
                        ) : (
                            <figure className="bg-base-200 h-48 flex items-center justify-center">
                                <span className="opacity-50">No Image</span>
                            </figure>
                        )}
                        <div className="card-body p-4">
                            <h2 className="card-title text-base">{game.name}</h2>
                            <div className="text-sm opacity-70">
                                {game.minPlayers && game.maxPlayers ? <div className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> {game.minPlayers === game.maxPlayers ? game.minPlayers : `${game.minPlayers} - ${game.maxPlayers}`}</div> : null}
                                {game.minPlayTime && game.maxPlayTime ? <div className="flex items-center gap-1.5 mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {game.minPlayTime === game.maxPlayTime ? game.minPlayTime : `${game.minPlayTime} - ${game.maxPlayTime}`} min</div> : null}
                                {[game.publisher, game.yearPublished].filter(Boolean).length > 0 && (
                                    <div className="mt-1">{[game.publisher, game.yearPublished].filter(Boolean).join(", ")}</div>
                                )}
                            </div>
                            {hasWriteAccess && (
                                <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200">
                                    <EditButton><UpsertModal editObject={game} action={editBoardgameAction.bind(null, game.id!)} /></EditButton>
                                    <DeleteButton id={game.id!} action={removeBoardgame} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                renderTableRow={(game, index) => (
                    <tr key={index} className="hover">
                        <td>
                            {game.image ? (
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12 shadow-sm">
                                        <img src={game.image} alt={game.name} className="object-cover" />
                                    </div>
                                </div>
                            ) : (
                                <div className="avatar placeholder">
                                    <div className="bg-base-200 text-base-content/50 mask mask-squircle w-12 h-12">
                                        <span className="text-xs">none</span>
                                    </div>
                                </div>
                            )}
                        </td>
                        <td className="font-bold text-base">{game.name}</td>
                        <td>
                            {game.minPlayers && game.maxPlayers ? (
                                <div className="badge badge-ghost badge-sm gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    {game.minPlayers === game.maxPlayers ? game.minPlayers : `${game.minPlayers} - ${game.maxPlayers}`}
                                </div>
                            ) : '-'}
                        </td>
                        <td>
                            {game.minPlayTime && game.maxPlayTime ? (
                                <div className="badge badge-ghost badge-sm gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {game.minPlayTime === game.maxPlayTime ? game.minPlayTime : `${game.minPlayTime} - ${game.maxPlayTime}`}m
                                </div>
                            ) : '-'}
                        </td>
                        <td className="text-sm opacity-80">{[game.publisher, game.yearPublished].filter(Boolean).join(", ")}</td>
                        <td>
                            <div className="flex justify-end space-x-2">
                                {hasWriteAccess && (
                                    <>
                                        <EditButton><UpsertModal editObject={game} action={editBoardgameAction.bind(null, game.id!)} /></EditButton>
                                        <DeleteButton id={game.id!} action={removeBoardgame} />
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
}