"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  
  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={async () => {
        await signOut();
        router.push("/");
      }}
    >
      Logout
    </button>
  );
}
