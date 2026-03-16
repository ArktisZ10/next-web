import { auth } from "@/lib/auth";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { LogoutButton } from "./LogoutButton";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { DiscordLoginButton } from "./DiscordLoginButton";

export async function UserMenu() {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex w-full items-center justify-center">
        <DiscordLoginButton className="btn btn-primary btn-sm w-full" />
      </div>
    );
  }

  const avatarUrl = session.user.image; // wherever you read it from

  const isAnimated =
    typeof avatarUrl === "string" &&
    (avatarUrl.endsWith(".gif") || avatarUrl.includes("/a_"));

  return (
    <div className="flex w-full items-center gap-3">
      {avatarUrl ? (
        <div className="avatar">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-base-300">
            <Image
              src={avatarUrl}
              alt={session.user.name || "User"}
              width={40}
              height={40}
              unoptimized={isAnimated}
            />
          </div>
        </div>
      ) : (
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-10">
            <UserIcon className="h-6 w-6 m-auto" />
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{session.user.name}</div>
        <div className="text-xs opacity-70 truncate">Logged in</div>
      </div>
      <div>
        <LogoutButton className="btn btn-sm btn-ghost text-error" />
      </div>
    </div>
  );
}
