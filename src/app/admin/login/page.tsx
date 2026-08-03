import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminPageAccess } from "@/server/auth/admin-access";

export default async function AdminLoginPage() {
  let authorized = false;
  try {
    await getAdminPageAccess();
    authorized = true;
  } catch {
    // A missing or unauthorized session should see the generic login form.
  }
  if (authorized) redirect("/admin/leads");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-2xl border border-[#d8ddd4] bg-[#fffdf7] p-8 shadow-xl shadow-[#173f32]/5">
        <p className="eyebrow">Yard To Table admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#173f32]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[#5b685f]">
          Sign in with your internal administrator account.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
