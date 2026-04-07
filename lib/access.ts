import { createAccessControl } from "better-auth/plugins/access";

/**
 * Domain-level access control for the app.
 *
 * Resources:
 *   - collection: boardgames, books, lego
 *   - household:  household todo lists / items
 *
 * User-management actions stay inside better-auth's admin plugin.
 */
export const ac = createAccessControl({
    collection: ["read", "create", "update", "delete"] as const,
    household:  ["read", "create", "update", "delete"] as const,
    // Mirrors the admin plugin's built-in defaultStatements so that the plugin's
    // internal hasPermission() checks resolve correctly against our custom roles.
    user:    ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"] as const,
    session: ["list", "revoke", "delete"] as const,
});

/** Visitors (default, unauthenticated-equivalent): read public collections only. */
export const visitorAc = ac.newRole({
    collection: ["read"],
    household:  [],
});

/**
 * Verified (friends & family): same as visitor for now.
 * Defined as a distinct role so write permissions can be added here later
 * without touching any call-sites.
 */
export const verifiedAc = ac.newRole({
    collection: ["read"],
    household:  [],
});

/** Household members: full CRUD on content + household todos. No user management. */
export const householdAc = ac.newRole({
    collection: ["read", "create", "update", "delete"],
    household:  ["read", "create", "update", "delete"],
});

/** Admins: same content powers as household, plus full user management via the admin plugin. */
export const adminAc = ac.newRole({
    collection: ["read", "create", "update", "delete"],
    household:  ["read", "create", "update", "delete"],
    user:    ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"],
    session: ["list", "revoke", "delete"],
});

export const roles = {
    visitor:   visitorAc,
    verified:  verifiedAc,
    household: householdAc,
    admin:     adminAc,
} as const;

export type AppRole = keyof typeof roles;
