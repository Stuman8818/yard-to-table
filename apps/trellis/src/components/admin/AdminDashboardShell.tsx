import type { ReactNode } from "react";
import Image from "next/image";

import { logoutAction } from "@/app/admin/actions";

import { AdminWorkNav, type AdminWorkView } from "./AdminWorkNav";
import { NeedsAttention } from "./NeedsAttention";

interface AdminDashboardShellProps {
  activeView: AdminWorkView;
  organizationName: string;
  userLabel: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AdminDashboardShell({
  activeView,
  organizationName,
  userLabel,
  title,
  description,
  children,
}: AdminDashboardShellProps) {
  return (
    <main className="min-h-screen bg-[#faf9f4] text-[#1b1c19]">
      <header className="bg-[#4a6741] text-white">
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="shrink-0 rounded bg-white p-1">
              <Image
                src="/Trellis Logo.png"
                alt="Trellis logo"
                width={132}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase">Trellis</p>
              <p className="truncate text-lg leading-tight font-bold">{organizationName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden font-semibold sm:inline">{userLabel}</span>
            <form action={logoutAction}>
              <button className="rounded-xl border border-white/40 px-4 py-1.5 text-sm font-semibold hover:bg-white/10">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-5 pt-9 sm:px-6 lg:px-12">
        <p className="text-xs font-bold tracking-[0.14em] text-[#65736a] uppercase">Operations</p>
        <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-[#061b0e] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-[#434843]">{description}</p>
        <div className="mt-8">
          <AdminWorkNav activeView={activeView} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 py-8 sm:px-6 lg:px-12">
        <NeedsAttention />
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
