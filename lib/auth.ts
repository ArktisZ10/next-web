import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/db/client";

function requiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing ${name} environment variable`);
	}
	return value;
}

const db = getDb();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
	// Avoid requiring replica-set transactions by default.
	transaction: false,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
          
          if (adminEmails.includes(user.email)) {
             return {
               data: {
                 ...user,
                 role: "admin"
               }
             }
          }
        }
      }
    }
  },
  secret: requiredEnv("AUTH_SECRET"),
  socialProviders: {
    discord: {
      clientId: requiredEnv("DISCORD_CLIENT_ID"),
      clientSecret: requiredEnv("DISCORD_CLIENT_SECRET"),
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "read-only",
      adminRole: "admin",
    })
  ],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
