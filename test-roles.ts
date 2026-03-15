import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
const auth = betterAuth({
  database: { provider: "sqlite", url: ":memory:" },
  plugins: [
    admin({
      defaultRole: "read-only",
      adminRole: "admin",
      // roles array or roles object?
    })
  ]
})
