import Link from "next/link";

import { logoutAction } from "../actions";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="max-w-lg rounded-2xl border border-[#d8ddd4] bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-[#173f32]">Access unavailable</h1>
        <p className="mt-3 text-[#5b685f]">
          Your account does not have access to the administrator leads area.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-lg border border-[#b8c5bb] px-4 py-2 font-semibold">
            Return home
          </Link>
          <form action={logoutAction}>
            <button className="rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
