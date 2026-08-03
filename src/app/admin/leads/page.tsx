import { redirect } from "next/navigation";
import Link from "next/link";

import { LeadStatus } from "@prisma/client";

import { logoutAction } from "@/app/admin/actions";
import { AdminLeads } from "@/components/admin/AdminLeads";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";
import { getAdminPageAccess } from "@/server/auth/admin-access";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error: unknown) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.slice(0, 100) : "";
  const status =
    typeof params.status === "string" &&
    Object.values(LeadStatus).includes(params.status as LeadStatus)
      ? params.status
      : "";
  const sort = params.sort === "oldest" ? "oldest" : "newest";

  return (
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="border-b border-[#d8ddd4] bg-[#173f32] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#b7d36b] uppercase">Admin</p>
            <p className="mt-1 font-semibold">{access.membership.organizationName}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-[#d1ddd4] sm:inline">
              {access.user.name ?? access.user.email}
            </span>
            <form action={logoutAction}>
              <button className="rounded-lg border border-white/30 px-4 py-2 font-semibold hover:bg-white/10">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#173f32]">Leads</h1>
        <p className="mt-2 text-[#5b685f]">Recent service requests for your organization.</p>
        <form
          method="get"
          className="mt-6 grid gap-4 rounded-xl border border-[#d8ddd4] bg-white p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end"
        >
          <div>
            <label htmlFor="search" className="block text-sm font-semibold">
              Search
            </label>
            <input
              id="search"
              name="search"
              defaultValue={search}
              placeholder="Name, email, or phone"
              className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-semibold">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
            >
              <option value="">All statuses</option>
              {Object.values(LeadStatus).map((value) => (
                <option key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-semibold">
              Sort
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white"
            >
              Apply
            </button>
            <Link
              href="/admin/leads"
              className="rounded-lg border border-[#b8c5bb] px-4 py-2 font-semibold"
            >
              Clear
            </Link>
          </div>
        </form>
        <div className="mt-8">
          <AdminLeads search={search || undefined} status={status || undefined} sort={sort} />
        </div>
      </section>
    </main>
  );
}
