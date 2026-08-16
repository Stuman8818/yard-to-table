import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";

export default async function JobsPage() {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  return (
    <AdminDashboardShell
      activeView="jobs"
      organizationName={access.membership.organizationName}
      userLabel={access.user.name ?? access.user.email ?? "User"}
      title="Jobs"
      description="Manage scheduled field work as job management becomes available."
    >
      <div className="rounded-xl border border-dashed border-[#b8c5bb] bg-white p-10 text-center">
        <h2 className="font-semibold text-[#173f32]">No jobs yet</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-[#5b685f]">
          Job management has not been added to Trellis yet. This workspace is ready for that
          workflow when it is available.
        </p>
      </div>
    </AdminDashboardShell>
  );
}
