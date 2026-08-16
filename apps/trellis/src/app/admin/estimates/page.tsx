import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { EstimatesList } from "@/components/admin/EstimatesList";
import type { EstimateStatus } from "@/graphql/generated/graphql";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";

export default async function EstimatesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const params = await searchParams;
  const search = params.search?.slice(0, 100).trim() || "";
  const status: EstimateStatus | undefined =
    params.status === "DRAFT" || params.status === "COMPLETED" ? params.status : undefined;
  return (
    <AdminDashboardShell
      activeView="estimates"
      organizationName={access.membership.organizationName}
      userLabel={access.user.name ?? access.user.email ?? "User"}
      title="Estimates"
      description="Review draft and completed estimates created from qualified leads."
    >
      <form
        method="get"
        className="grid gap-3 rounded-xl border border-[#d8ddd4] bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
      >
        <div>
          <label htmlFor="estimate-search" className="block text-sm font-semibold">
            Search estimates
          </label>
          <input
            id="estimate-search"
            name="search"
            defaultValue={search}
            placeholder="Customer, email, or details"
            className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="estimate-status" className="block text-sm font-semibold">
            Status
          </label>
          <select
            id="estimate-status"
            name="status"
            defaultValue={status ?? ""}
            className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="COMPLETED">Completed</option>
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
            href="/admin/estimates"
            className="rounded-lg border border-[#b8c5bb] px-4 py-2 font-semibold"
          >
            Clear
          </Link>
        </div>
      </form>
      <div className="mt-6">
        <EstimatesList search={search || undefined} status={status} />
      </div>
    </AdminDashboardShell>
  );
}
