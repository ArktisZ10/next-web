"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [players, setPlayers] = useState(searchParams.get("players") || "");
  const [playtime, setPlaytime] = useState(searchParams.get("playtime") || "");

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      if (players) {
        params.set("players", players);
      } else {
        params.delete("players");
      }
      if (playtime) {
        params.set("playtime", playtime);
      } else {
        params.delete("playtime");
      }
      router.push(`?${params.toString()}`);
    },
    [searchTerm, players, playtime, searchParams, router]
  );

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center justify-center">
      <div className="join shadow-sm">
        <input
          type="text"
          placeholder="Search games..."
          className="input input-bordered join-item input-sm w-48 md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-sm join-item btn-primary">
          Search
        </button>
      </div>

      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-sm btn-ghost border-base-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {(players || playtime) && (
            <div className="w-2 h-2 rounded-full bg-primary ml-1"></div>
          )}
        </div>
        <div tabIndex={0} className="dropdown-content z-50 p-4 shadow-xl bg-base-100 rounded-box w-64 mt-2 border border-base-200 flex flex-col gap-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium">Player Count</span>
            </label>
            <input
              type="number"
              placeholder="Any number of players"
              className="input input-bordered input-sm w-full"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium">Max Playtime (min)</span>
            </label>
            <input
              type="number"
              placeholder="Any playtime"
              className="input input-bordered input-sm w-full"
              value={playtime}
              onChange={(e) => setPlaytime(e.target.value)}
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button 
              type="button" 
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setPlayers("");
                setPlaytime("");
                // Close dropdown by removing focus from active element
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
            >
              Clear
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              Apply
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
