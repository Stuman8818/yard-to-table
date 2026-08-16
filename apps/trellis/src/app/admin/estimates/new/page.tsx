import Link from "next/link";
import { redirect } from "next/navigation";
import { EstimateForm } from "@/components/admin/EstimateForm";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError, canEditLeads } from "@/server/auth/auth-service";

export default async function NewEstimatePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  if (!canEditLeads(access.membership.role)) redirect("/admin/unauthorized");
  const params = await searchParams;
  const leadId = typeof params.leadId === "string" ? params.leadId : "";
  if (!leadId) redirect("/admin/leads");
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
          <EstimateForm leadId={leadId} />
        </div>
      </section>
    </main>
  );
}
