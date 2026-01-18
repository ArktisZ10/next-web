import { auth } from "@/auth";
import { UserIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { unstable_noStore as noStore } from "next/cache";

export async function UserMenu() {
  noStore();
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex-none gap-2">
        <Link href="/login" className="btn btn-ghost btn-sm">
          Login
        </Link>
        <Link href="/signup" className="btn btn-primary btn-sm">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow"
        >
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
