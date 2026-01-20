import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
  database: {
    type: "mongodb",
    client: mongoClient,
  },
  secret: process.env.AUTH_SECRET!,
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
