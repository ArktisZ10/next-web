"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={async () => {
        await signOut({ redirectTo: "/login" });
      }}
    >
      Logout
    </button>
  );
}
