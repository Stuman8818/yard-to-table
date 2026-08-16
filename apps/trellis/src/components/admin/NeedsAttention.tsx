"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { DashboardAttentionDocument } from "@/graphql/generated/graphql";

export function NeedsAttention() {
  const { data, loading, error } = useQuery(DashboardAttentionDocument, {
    fetchPolicy: "cache-and-network",
  });

  const today = new Date();
  const consultationsToday =
    data?.consultations.filter((consultation) => {
      const date = new Date(consultation.scheduledStart);
      return (
        consultation.status === "SCHEDULED" &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length ?? 0;

  const metrics = [
    { label: "New leads", value: data?.newLeads.length ?? 0, href: "/admin/leads?status=NEW" },
    {
      label: "Consultations today",
      value: consultationsToday,
      href: "/admin/consultations?scope=upcoming",
    },
    {
      label: "Open estimates",
      value: data?.openEstimates.length ?? 0,
      href: "/admin/estimates?status=DRAFT",
    },
  ];

  return (
    <section aria-labelledby="needs-attention-heading">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 id="needs-attention-heading" className="text-sm font-semibold text-[#1b1c19]">
          Needs attention
        </h2>
        {error ? <span className="text-xs text-[#8a4036]">Summary unavailable</span> : null}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="rounded-lg border border-[#c3c8c1]/40 bg-white p-6 shadow-sm transition hover:border-[#9eafa2] hover:shadow-md"
          >
            <p className="text-[11px] font-bold tracking-wider text-[#5d655f] uppercase">
              {metric.label}
            </p>
            <p className="mt-2 text-[32px] leading-tight font-bold tabular-nums text-[#1b1c19]">
              {loading && !data ? "—" : metric.value}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
