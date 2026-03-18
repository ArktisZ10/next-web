import { ReactNode } from 'react';

type CollectionViewProps<T> = {
    items: T[];
    view: 'table' | 'grid' | string;
    renderCard: (item: T, index: number) => ReactNode;
    renderTableRow: (item: T, index: number) => ReactNode;
    tableHeaders: ReactNode;
};

export default function CollectionView<T>({ 
    items, 
    view, 
    renderCard, 
    renderTableRow, 
    tableHeaders 
}: CollectionViewProps<T>) {
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-base-100 border border-base-200 rounded-box shadow-xl text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold opacity-70">No items found</h3>
                <p className="opacity-50 mt-2 max-w-md">There are currently no items in this collection or matching your search filters.</p>
            </div>
        );
    }

    if (view === 'grid') {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {items.map((item, index) => renderCard(item, index))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-base-100 border border-base-200 rounded-box shadow-xl">
            <table className="table table-md table-zebra table-pin-rows table-pin-cols">
                <thead className="bg-base-200/50">
                    {tableHeaders}
                </thead>
                <tbody>
                    {items.map((item, index) => renderTableRow(item, index))}
                </tbody>
                <tfoot className="bg-base-200/50">
                    {tableHeaders}
                </tfoot>
            </table>
        </div>
    );
}