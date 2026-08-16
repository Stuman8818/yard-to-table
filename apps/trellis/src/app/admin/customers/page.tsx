import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { CustomersList } from "@/components/admin/CustomersList";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const search = (await searchParams).search?.slice(0, 100).trim() || "";
  return (
    <AdminDashboardShell
      activeView="customers"
      organizationName={access.membership.organizationName}
      userLabel={access.user.name ?? access.user.email ?? "User"}
      title="Customers"
      description="Find converted customers and open their property and consultation records."
    >
      <form
        method="get"
        className="flex flex-col gap-3 rounded-xl border border-[#d8ddd4] bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="customer-search" className="block text-sm font-semibold">
            Search customers
          </label>
          <input
            id="customer-search"
            name="search"
            defaultValue={search}
            placeholder="Name, email, or phone"
            className="mt-2 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white"
          >
            Search
          </button>
          <Link
            href="/admin/customers"
            className="rounded-lg border border-[#b8c5bb] px-4 py-2 font-semibold"
          >
            Clear
          </Link>
        </div>
      </form>
      <div className="mt-6">
        <CustomersList search={search || undefined} />
      </div>
    </AdminDashboardShell>
  );
}
