import { betterAuth } from "better-auth";
const auth = betterAuth({
  database: { provider: "sqlite", url: ":memory:" },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
        }
      }
    }
  }
});
