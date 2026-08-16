import Link from "next/link";
import { redirect } from "next/navigation";
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
    <main className="min-h-screen bg-[#f6f4ed]">
      <header className="bg-[#173f32] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-semibold">
          {access.membership.organizationName}
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#173f32]">Consultations</h1>
            <p className="mt-2 text-[#5b685f]">Customer consultation schedule and history.</p>
          </div>
          <Link href="/admin/leads" className="font-semibold text-[#476654] hover:underline">
            Leads
          </Link>
        </div>
        <nav className="my-6 flex gap-2">
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
      </section>
    </main>
  );
}
