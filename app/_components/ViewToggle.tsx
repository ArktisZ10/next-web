'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setViewCookie } from '../_actions';

export default function ViewToggle({ currentView, cookieName }: { currentView: string; cookieName: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = (view: 'table' | 'grid') => {
        startTransition(async () => {
            await setViewCookie(cookieName, view);
            router.refresh();
        });
    };

    return (
        <div className="join">
            <button 
                disabled={isPending}
                className={`join-item btn btn-sm px-2 ${currentView === 'table' ? 'btn-active' : ''}`}
                onClick={() => handleToggle('table')}
                title="Table View"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 011.875 1.875v11.25a1.875 1.875 0 01-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V6.375A1.875 1.875 0 015.625 4.5z" />
                </svg>
            </button>
            <button 
                disabled={isPending}
                className={`join-item btn btn-sm px-2 ${currentView === 'grid' ? 'btn-active' : ''}`}
                onClick={() => handleToggle('grid')}
                title="Grid View"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            </button>
        </div>
    );
}