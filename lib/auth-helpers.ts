import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { roles } from "./access";

type CollectionAction = "read" | "create" | "update" | "delete";
type HouseholdAction  = "read" | "create" | "update" | "delete";
type UserAction       = "create" | "list" | "set-role" | "ban" | "impersonate" | "delete" | "set-password" | "get" | "update";
type SessionAction    = "list" | "revoke" | "delete";

interface Permissions {
    collection?: CollectionAction[];
    household?:  HouseholdAction[];
    user?:       UserAction[];
    session?:    SessionAction[];
}

type AuthorizableRole = { authorize: (permissions: Permissions) => { success: boolean } };

/** Returns true if the given role string has all the requested permissions. */
function checkPermission(roleString: string | undefined, permissions: Permissions): boolean {
    const roleNames = (roleString?.trim() || "visitor").split(",");
    for (const roleName of roleNames) {
        const r = roles[roleName.trim() as keyof typeof roles] as AuthorizableRole | undefined;
        if (r && r.authorize(permissions).success) {
            return true;
        }
    }
    return false;
}

/**
 * Assert the current session has the required permissions.
 * Redirects to `redirectTo` if unauthenticated; throws if authenticated but unauthorised.
 */
export async function requirePermission(
    permissions: Permissions,
    redirectTo = "/",
) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect(redirectTo);
    }

    if (!checkPermission(session.user.role ?? undefined, permissions)) {
        throw new Error("Unauthorized");
    }

    return session;
}

/**
 * Assert the current user is an admin.
 * Used for user-management actions (/admin panel).
 */
export async function requireAdmin(redirectTo = "/") {
    return requirePermission({ user: ["list"] }, redirectTo);
}

/**
 * Returns `true` if the current session has the required permissions.
 * Non-throwing; useful for conditional rendering in Server Components.
 */
export async function sessionHasPermission(permissions: Permissions): Promise<boolean> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;
    return checkPermission(session.user.role ?? undefined, permissions);
}
