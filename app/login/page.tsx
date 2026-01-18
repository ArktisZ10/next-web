import { signIn } from "@/auth";
import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const redirectTo =
    typeof resolvedSearchParams.redirectTo === "string" &&
    resolvedSearchParams.redirectTo.length > 0
      ? resolvedSearchParams.redirectTo
      : "/";
  const error =
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">Please enter your credentials to continue.</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          {error ? (
            <div className="alert alert-error rounded-none">
              <span>
                {error === "CredentialsSignin"
                  ? "Invalid username or password."
                  : "Sign in failed. Please try again."}
              </span>
            </div>
          ) : null}
          <form
            className="card-body"
            action={async (formData) => {
              "use server";
              try {
                const username = formData.get("username");
                const password = formData.get("password");
                const redirectTo = formData.get("redirectTo");

                await signIn("credentials", {
                  username,
                  password,
                  redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
                });
              } catch (err) {
                const authErrorType =
                  err instanceof AuthError
                    ? err.type
                    : err &&
                        typeof err === "object" &&
                        "type" in err &&
                        typeof (err as { type?: unknown }).type === "string"
                      ? (err as { type: string }).type
                      : null;

                if (authErrorType) {
                  const params = new URLSearchParams();
                  params.set("error", authErrorType);
                  const rt = formData.get("redirectTo");
                  if (typeof rt === "string" && rt.length > 0) {
                    params.set("redirectTo", rt);
                  }
                  redirect(`/login?${params.toString()}`);
                }
                throw err;
              }
            }}
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="username"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="text-center mt-4">
              <Link href="/signup" className="link link-hover">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
