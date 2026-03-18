import { getLegos, LegoEntity } from "@/db/collections/Lego";
import AddModalButton from "./_components/AddModalButton";
import EditModalButton from "./_components/EditModalButton";
import RemoveButton from "./_components/DeleteButton";
import ViewToggle from "../_components/ViewToggle";
import SearchForm from "./_components/SearchForm";
import CollectionView from "../_components/CollectionView";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export const revalidate = 600;

const TableHeaders = (
    <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Set Number</th>
        <th>Theme</th>
        <th>Details</th>
        <th></th>
    </tr>
);

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LegoPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const search = searchParams.q as string | undefined;

    const legos = await getLegos({ 
        search 
    });
    
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList,
    });
    
    const cookieStore = await cookies();
    const currentView = cookieStore.get('legoView')?.value || 'table';

    const hasWriteAccess = session?.user?.role === 'admin' || session?.user?.role === 'write';
    
    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center w-full gap-4">
                    <div className="flex-none flex items-center gap-4">
                        <h1 className="text-3xl font-bold">Lego</h1>
                        {hasWriteAccess && <AddModalButton />}
                    </div>
                    <div className="grow flex justify-end">
                        <SearchForm />
                    </div>
                    <div className="flex-none">
                        <ViewToggle currentView={currentView} cookieName="legoView" />
                    </div>
                </div>
            </div>
            
            <CollectionView
                items={legos}
                view={currentView}
                tableHeaders={TableHeaders}
                renderCard={(lego: LegoEntity, index: number) => (
                    <div key={index} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
                        {lego.image ? (
                            <figure>
                                <img src={lego.image} alt={lego.name} className="w-full h-48 object-cover" />
                            </figure>
                        ) : (
                            <figure className="bg-base-200 h-48 flex items-center justify-center">
                                <span className="opacity-50">No Image</span>
                            </figure>
                        )}
                        <div className="card-body p-4">
                            <h2 className="card-title text-base">{lego.name}</h2>
                            <div className="text-sm opacity-70">
                                {lego.setNumber && <div className="font-semibold">{lego.setNumber}</div>}
                                {[lego.theme, lego.yearReleased].filter(Boolean).length > 0 && (
                                    <div className="mt-1">{[lego.theme, lego.yearReleased].filter(Boolean).join(", ")}</div>
                                )}
                                {lego.pieceCount && <div>{lego.pieceCount} pieces</div>}
                                {lego.minifigures && <div className="text-xs mt-1 text-base-content/50">{lego.minifigures} minifigures</div>}
                            </div>
                            {hasWriteAccess && (
                                <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200">
                                    <EditModalButton editObject={lego} />
                                    <RemoveButton id={lego.id} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                renderTableRow={(lego: LegoEntity, index: number) => (
                    <tr key={index} className="hover">
                        <td>
                            {lego.image ? (
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12 shadow-sm">
                                        <img src={lego.image} alt={lego.name} className="object-cover" />
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
                        <td className="font-bold text-base">{lego.name}</td>
                        <td>{lego.setNumber || '-'}</td>
                        <td>
                            <div className="text-sm">
                                <div>{lego.theme || '-'}</div>
                                {lego.yearReleased && <div className="opacity-70 text-xs">{lego.yearReleased}</div>}
                            </div>
                        </td>
                        <td>
                            <div className="text-sm">
                                {lego.pieceCount && <div>{lego.pieceCount} pcs</div>}
                                {lego.minifigures && <div className="text-xs opacity-70 text-base-content/50" title="Minifigures">{lego.minifigures} minifigs</div>}
                                {!lego.pieceCount && !lego.minifigures && '-'}
                            </div>
                        </td>
                        <td>
                            <div className="flex justify-end space-x-2">
                                {hasWriteAccess && (
                                    <>
                                        <EditModalButton editObject={lego} />
                                        <RemoveButton id={lego.id} />
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