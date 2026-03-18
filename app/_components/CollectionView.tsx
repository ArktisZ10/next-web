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