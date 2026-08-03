import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { AdminLeads } from "@/components/admin/AdminLeads";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";
import { getAdminPageAccess } from "@/server/auth/admin-access";

export default async function AdminLeadsPage() {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error: unknown) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }

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
        <div className="mt-8">
          <AdminLeads />
        </div>
      </section>
    </main>
  );
}
