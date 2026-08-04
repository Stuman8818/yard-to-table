import Link from "next/link";
import { redirect } from "next/navigation";
import { LeadConsultationScheduler } from "@/components/admin/LeadConsultationScheduler";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";

export default async function ScheduleLeadConsultationPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  if (!canEditLeads(access.membership.role)) redirect("/admin/unauthorized");
  const { leadId } = await params;
  return (
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-semibold">
          {access.membership.organizationName}
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href={`/admin/leads/${leadId}`}
          className="font-semibold text-[#476654] hover:underline"
        >
          Back to lead
        </Link>
        <div className="mt-6">
          <LeadConsultationScheduler leadId={leadId} />
        </div>
      </section>
    </main>
  );
}
