import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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
                {error === "CredentialsSignin" || error === "invalid_credentials"
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
                const email = formData.get("username");
                const password = formData.get("password");
                const redirectTo = formData.get("redirectTo");

                if (!email || !password) {
                  const params = new URLSearchParams();
                  params.set("error", "invalid_credentials");
                  const rt = formData.get("redirectTo");
                  if (typeof rt === "string" && rt.length > 0) {
                    params.set("redirectTo", rt);
                  }
                  redirect(`/login?${params.toString()}`);
                }

                await auth.api.signInEmail({
                  body: {
                    email: email as string,
                    password: password as string,
                  },
                });

                redirect(typeof redirectTo === "string" ? redirectTo : "/");
              } catch {
                const params = new URLSearchParams();
                params.set("error", "invalid_credentials");
                const rt = formData.get("redirectTo");
                if (typeof rt === "string" && rt.length > 0) {
                  params.set("redirectTo", rt);
                }
                redirect(`/login?${params.toString()}`);
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
