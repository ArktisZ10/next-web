"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function DiscordLoginButton({ className }: { className?: string }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        try {
          await authClient.signIn.social({
            provider: "discord",
          });
        } finally {
          setIsPending(false);
        }
      }}
    >
      Login with Discord
    </button>
  );
}
