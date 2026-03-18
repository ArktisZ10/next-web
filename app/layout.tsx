import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bars3Icon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { UserMenu } from "./_components/UserMenu";
import { DrawerLink } from "./_components/DrawerLink";
import { AdminDrawerLink } from "./_components/AdminDrawerLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Börne.se",
  description: "A collection of board games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased drawer`}>
        <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <header className="navbar bg-base-300 shadow-sm relative z-50">
            <div className="flex-none">
              <label htmlFor="nav-drawer" className="btn btn-square btn-ghost">
                <Bars3Icon className="h-5 w-5" />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-xl">Börne.se</Link>
            </div>
            <div className="flex-none gap-2">
              <a 
                href="https://github.com/ArktisZ10" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-square btn-ghost"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/erik-borne"
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-square btn-ghost"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </header>
          {children}
        </div>
        <nav className="drawer-side">
          <label htmlFor="nav-drawer" aria-label="close sidebar" className="drawer-overlay cursor-default" />
          <div className="bg-base-200 min-h-full w-80 flex flex-col shadow-xl">
            <div className="p-4 border-b border-base-300">
              <Link href="/" className="text-2xl font-bold px-4 py-2 block">Börne.se</Link>
            </div>
            
            <ul className="menu p-4 w-full flex-1 gap-2 text-base font-medium">
              <li>
                <DrawerLink href="/">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Home
                </DrawerLink>
              </li>
              <li>
                <DrawerLink href="/boardgames">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>
                  </svg>
                  Board Games
                </DrawerLink>
              </li>
              <AdminDrawerLink />
            </ul>

            <div className="p-4 border-t border-base-300 bg-base-200/50">
              <UserMenu />
            </div>
          </div>
        </nav>
      </body>
    </html>
  );
}
