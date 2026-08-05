import Link from "next/link";
import { redirect } from "next/navigation";
import { EstimateDetails } from "@/components/admin/EstimateDetails";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";

export default async function EstimatePage({
  params,
}: {
  params: Promise<{ estimateId: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const { estimateId } = await params;
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
          <EstimateDetails estimateId={estimateId} canEdit={canEditLeads(access.membership.role)} />
        </div>
      </section>
    </main>
  );
}
