import Link from "next/link";

export type AdminWorkView = "leads" | "customers" | "consultations" | "estimates" | "jobs";

const views: { id: AdminWorkView; label: string; href: string }[] = [
  { id: "leads", label: "Leads", href: "/admin/leads" },
  { id: "customers", label: "Customers", href: "/admin/customers" },
  { id: "consultations", label: "Consultations", href: "/admin/consultations" },
  { id: "estimates", label: "Estimates", href: "/admin/estimates" },
  { id: "jobs", label: "Jobs", href: "/admin/jobs" },
];

export function AdminWorkNav({ activeView }: { activeView: AdminWorkView }) {
  return (
    <nav
      aria-label="Operations work areas"
      className="overflow-x-auto border-b border-[#c3c8c1]/70"
    >
      <div className="flex min-w-max gap-8">
        {views.map((view) => {
          const active = activeView === view.id;
          return (
            <Link
              key={view.id}
              href={view.href}
              aria-current={active ? "page" : undefined}
              className={`border-b-2 pb-3 text-sm font-semibold tracking-wide transition-colors ${
                active
                  ? "border-[#173f32] text-[#173f32]"
                  : "border-transparent text-[#65736a] hover:border-[#aebbb1] hover:text-[#263c31]"
              }`}
            >
              {view.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
