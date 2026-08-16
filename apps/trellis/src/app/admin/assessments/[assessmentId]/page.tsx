import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyAssessmentDetails } from "@/components/admin/PropertyAssessmentDetails";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const { assessmentId } = await params;
  return (
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-semibold">
          {access.membership.organizationName}
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/admin/leads" className="font-semibold text-[#476654] hover:underline">
          Back to leads
        </Link>
        <div className="mt-6">
          <PropertyAssessmentDetails
            assessmentId={assessmentId}
            canEdit={canEditLeads(access.membership.role)}
          />
        </div>
      </section>
    </main>
  );
}
