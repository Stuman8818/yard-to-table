import Link from "next/link";
import { redirect } from "next/navigation";
import { ConsultationDetails } from "@/components/admin/ConsultationDetails";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const { consultationId } = await params;
  return (
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-semibold">
          {access.membership.organizationName}
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/admin/consultations" className="font-semibold text-[#476654] hover:underline">
          Back to consultations
        </Link>
        <div className="mt-6">
          <ConsultationDetails
            consultationId={consultationId}
            canEdit={canEditLeads(access.membership.role)}
          />
        </div>
      </section>
    </main>
  );
}
