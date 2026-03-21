import { getBooks, BookEntity } from "@/db/collections/Book";
import UpsertModal from "./_components/UpsertModal";
import { addBookAction, editBookAction, removeBook } from "./_actions";
import AddButton from "../_components/AddButton";
import EditButton from "../_components/EditButton";
import DeleteButton from "../_components/DeleteButton";
import ViewToggle from "../_components/ViewToggle";
import SearchForm from "../_components/SearchForm";
import CollectionView from "../_components/CollectionView";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export const revalidate = 600;

const TableHeaders = (
    <tr>
        <th>Image</th>
        <th>Title</th>
        <th>Author</th>
        <th>Publisher</th>
        <th>Details</th>
        <th></th>
    </tr>
);

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function BooksPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const search = searchParams.q as string | undefined;

    const books = await getBooks({ 
        search 
    });
    
    const headersList = await headers();
    const session = await auth.api.getSession({
        headers: headersList,
    });
    
    const cookieStore = await cookies();
    const currentView = cookieStore.get('booksView')?.value || 'table';

    const hasWriteAccess = session?.user?.role === 'admin' || session?.user?.role === 'write';

    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center w-full gap-4">
                    <div className="flex-none flex items-center gap-4">
                        <h1 className="text-3xl font-bold">Books</h1>
                        {hasWriteAccess && <AddButton label="Add new book"><UpsertModal action={addBookAction} /></AddButton>}
                    </div>
                    <div className="grow flex justify-end">
                        <SearchForm placeholder="Search books..." />
                    </div>
                    <div className="flex-none">
                        <ViewToggle currentView={currentView} cookieName="booksView" />
                    </div>
                </div>
            </div>
            
            <CollectionView
                items={books}
                view={currentView}
                tableHeaders={TableHeaders}
                renderCard={(book: BookEntity, index: number) => (
                    <div key={index} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
                        {book.image ? (
                            <figure>
                                <img src={book.image} alt={book.title} className="w-full h-48 object-cover" />
                            </figure>
                        ) : (
                            <figure className="bg-base-200 h-48 flex items-center justify-center">
                                <span className="opacity-50">No Image</span>
                            </figure>
                        )}
                        <div className="card-body p-4">
                            <h2 className="card-title text-base">{book.title}</h2>
                            <div className="text-sm opacity-70">
                                {book.author && <div className="font-semibold">{book.author}</div>}
                                {[book.publisher, book.yearPublished].filter(Boolean).length > 0 && (
                                    <div className="mt-1">{[book.publisher, book.yearPublished].filter(Boolean).join(", ")}</div>
                                )}
                                {book.pages && <div>{book.pages} pages</div>}
                                {book.isbn && <div className="text-xs mt-1 text-base-content/50">ISBN: {book.isbn}</div>}
                            </div>
                            {hasWriteAccess && (
                                <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200">
                                    <EditButton><UpsertModal editObject={book} action={editBookAction.bind(null, book.id!)} /></EditButton>
                                    <DeleteButton id={book.id!} action={removeBook} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                renderTableRow={(book: BookEntity, index: number) => (
                    <tr key={index} className="hover">
                        <td>
                            {book.image ? (
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12 shadow-sm">
                                        <img src={book.image} alt={book.title} className="object-cover" />
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
                        <td className="font-bold text-base">{book.title}</td>
                        <td>{book.author || '-'}</td>
                        <td>
                            <div className="text-sm">
                                <div>{book.publisher || '-'}</div>
                                {book.yearPublished && <div className="opacity-70 text-xs">{book.yearPublished}</div>}
                            </div>
                        </td>
                        <td>
                            <div className="text-sm">
                                {book.pages && <div>{book.pages} pp</div>}
                                {book.isbn && <div className="text-xs opacity-70 text-base-content/50" title="ISBN">{book.isbn}</div>}
                                {!book.pages && !book.isbn && '-'}
                            </div>
                        </td>
                        <td>
                            <div className="flex justify-end space-x-2">
                                {hasWriteAccess && (
                                    <>
                                        <EditButton><UpsertModal editObject={book} action={editBookAction.bind(null, book.id!)} /></EditButton>
                                        <DeleteButton id={book.id!} action={removeBook} />
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