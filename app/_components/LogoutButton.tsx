"use client";

import { signOut } from "@/lib/auth-client";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className || "w-full text-left"}
      onClick={async () => {
        await signOut();
        // Hard reload guarantees server components (like the header UserMenu)
        // re-render using the now-cleared auth cookie.
        window.location.assign("/");
      }}
    >
      Logout
    </button>
  );
}
