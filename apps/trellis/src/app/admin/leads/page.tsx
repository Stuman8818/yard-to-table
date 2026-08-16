import { redirect } from "next/navigation";
import Link from "next/link";

import { LeadStatus } from "@prisma/client";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
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
    <AdminDashboardShell
      activeView="leads"
      organizationName={access.membership.organizationName}
      userLabel={access.user.name ?? access.user.email ?? "User"}
      title="Leads"
      description="Manage new service requests and move prospects through the customer workflow."
    >
      <form
        method="get"
        className="mt-6 grid gap-4 md:grid-cols-[minmax(16rem,1fr)_16rem_12rem_auto] md:items-end"
      >
        <div>
          <label htmlFor="search" className="block text-xs font-bold">
            Search
          </label>
          <input
            id="search"
            name="search"
            defaultValue={search}
            placeholder="Name, email, or phone"
            className="mt-1.5 w-full rounded border border-[#c3c8c1]/70 bg-white px-4 py-2.5 focus:ring-1 focus:ring-[#061b0e] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-bold">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="mt-1.5 w-full rounded border border-[#c3c8c1]/70 bg-white px-4 py-2.5 focus:ring-1 focus:ring-[#061b0e] focus:outline-none"
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
          <label htmlFor="sort" className="block text-xs font-bold">
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="mt-1.5 w-full rounded border border-[#c3c8c1]/70 bg-white px-4 py-2.5 focus:ring-1 focus:ring-[#061b0e] focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-[#4a6741] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3e5837]"
          >
            Apply
          </button>
          <Link
            href="/admin/leads"
            className="rounded-lg border border-[#c3c8c1]/70 bg-white px-6 py-2.5 text-sm font-semibold hover:bg-[#f5f4ef]"
          >
            Clear
          </Link>
        </div>
      </form>
      <div className="mt-6">
        <AdminLeads search={search || undefined} status={status || undefined} sort={sort} />
      </div>
    </AdminDashboardShell>
  );
}
