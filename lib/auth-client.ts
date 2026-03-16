import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

function getBaseURL() {
  // Browser: best source of truth (works for custom domains + previews)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server: prefer explicit configuration (works everywhere, including local dev)
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    return explicit;
  }

  // Server on Vercel: hostname without scheme
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // Avoid accidentally using localhost in production.
  if (["production", "development"].includes(process.env.VERCEL_ENV ?? "")) {
    throw new Error("Missing environment variable NEXT_PUBLIC_APP_URL (or VERCEL_URL) in production!");
  }

  // Local dev SSR fallback
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [adminClient()],
});

export const { signOut, useSession } = authClient;
