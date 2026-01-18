"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={async () => {
        const response = await signOut({ redirect: false, redirectTo: "/login" });
        router.push(response.url);
        router.refresh();
      }}
    >
      Logout
    </button>
  );
}
