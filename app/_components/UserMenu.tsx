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
      <div className="flex-none gap-2">
        <DiscordLoginButton className="btn btn-primary btn-sm" />
      </div>
    );
  }

  const avatarUrl = session.user.image; // wherever you read it from

  const isAnimated =
    typeof avatarUrl === "string" &&
    (avatarUrl.endsWith(".gif") || avatarUrl.includes("/a_"));

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                unoptimized={isAnimated}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <UserIcon className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-100 mt-3 w-52 p-2 shadow">
          <li className="menu-title">
            <span>{session.user.name}</span>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
