"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function DiscordLoginButton({
  className,
}: {
  className?: string;
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);
        try {
          // Use disableRedirect so we control navigation in the browser.
          const { data, error } = await authClient.signIn.social({
            provider: "discord",
            disableRedirect: true,
          });

          if (error) {
            console.error(error);
            return;
          }

          const url = data?.url;
          if (url) {
            window.location.assign(url);
          }
        } finally {
          setIsPending(false);
        }
      }}
    >
      Login with Discord
    </button>
  );
}
