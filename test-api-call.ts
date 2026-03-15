import { auth } from "./lib/auth";
async function x() {
    const res = await auth.api.listUsers({ query: { limit: 100 }, headers: new Headers() });
}
