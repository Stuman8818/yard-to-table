import Link from "next/link";
import { redirect } from "next/navigation";

import { CustomerDetails } from "@/components/admin/CustomerDetails";
import { getAdminPageAccess } from "@/server/auth/admin-access";
import { AuthenticationRequiredError } from "@/server/auth/auth-service";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  let access;
  try {
    access = await getAdminPageAccess();
  } catch (error: unknown) {
    if (error instanceof AuthenticationRequiredError) redirect("/admin/login");
    redirect("/admin/unauthorized");
  }
  const { customerId } = await params;
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
          <CustomerDetails customerId={customerId} />
        </div>
      </section>
    </main>
  );
}
