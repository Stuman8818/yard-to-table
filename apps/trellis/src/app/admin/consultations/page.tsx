import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { ConsultationsList } from "@/components/admin/ConsultationsList";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";
import type { ConsultationScope } from "@/graphql/generated/graphql";

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const requested = (await searchParams).scope?.toUpperCase();
  const scope: ConsultationScope =
    requested === "PAST" || requested === "ALL" ? requested : "UPCOMING";
  return (
    <AdminDashboardShell
      activeView="consultations"
      organizationName={access.membership.organizationName}
      userLabel={access.user.name ?? access.user.email ?? "User"}
      title="Consultations"
      description="Review upcoming appointments and consultation history."
    >
      <nav aria-label="Consultation scope" className="mb-6 flex gap-2 overflow-x-auto">
        {["upcoming", "past", "all"].map((value) => (
          <Link
            key={value}
            href={`/admin/consultations?scope=${value}`}
            className={`rounded-lg px-4 py-2 font-semibold ${scope === value.toUpperCase() ? "bg-[#173f32] text-white" : "bg-white"}`}
          >
            {value[0]?.toUpperCase()}
            {value.slice(1)}
          </Link>
        ))}
      </nav>
      <ConsultationsList scope={scope} />
    </AdminDashboardShell>
  );
}
