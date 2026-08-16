import Link from "next/link";
import { redirect } from "next/navigation";

import { LeadDetails } from "@/components/admin/LeadDetails";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";
import { getAdminPageAccess } from "@/server/auth/admin-access";

export default async function LeadDetailsPage({ params }: { params: Promise<{ leadId: string }> }) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error: unknown) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const { leadId } = await params;
  return (
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="border-b border-[#d8ddd4] bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-xs font-bold tracking-[0.16em] text-[#b7d36b] uppercase">
            {access.membership.organizationName}
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/admin/leads" className="font-semibold text-[#476654] hover:underline">
          Back to leads
        </Link>
        <div className="mt-6">
          <LeadDetails leadId={leadId} canEdit={canEditLeads(access.membership.role)} />
        </div>
      </section>
    </main>
  );
}
