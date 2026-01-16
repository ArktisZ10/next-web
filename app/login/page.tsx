import { signIn } from "@/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
          <p className="py-6">Please enter your credentials to continue.</p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form
            className="card-body"
            action={async (formData) => {
              "use server";
              await signIn("credentials", formData);
            }}
          >
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
