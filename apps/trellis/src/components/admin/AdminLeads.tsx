"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { LeadsDocument, type LeadStatus } from "@/graphql/generated/graphql";
import { deriveLeadWorkflowStatus, leadWorkflowStatusLabel } from "@/lib/lead-workflow";

const leadStatuses = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "CONSULTATION_COMPLETED",
  "ASSESSMENT_COMPLETED",
  "ESTIMATE_SENT",
  "ESTIMATE_COMPLETED",
  "CONVERTED",
  "LOST",
] as const satisfies readonly LeadStatus[];

interface AdminLeadsProps {
  search?: string;
  status?: string;
  sort: "newest" | "oldest";
}

export function AdminLeads({ search, status, sort }: AdminLeadsProps) {
  const validStatus = leadStatuses.find((value) => value === status);
  const { data, dataState, loading, error } = useQuery(LeadsDocument, {
    ssr: false,
    variables: {
      search: search || undefined,
      status: validStatus,
      sort: sort === "oldest" ? "OLDEST" : "NEWEST",
    },
  });

  if (loading) return <p className="py-12 text-center text-[#5b685f]">Loading leads...</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-[#fbe8e4] p-5 text-[#7d2d22]">
        Leads could not be loaded. Please try again.
      </p>
    );
  if (dataState !== "complete" || !data?.leads.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#b8c5bb] bg-white p-10 text-center">
        <h2 className="font-semibold text-[#173f32]">No matching leads</h2>
        <p className="mt-2 text-sm text-[#5b685f]">Try clearing the current search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#c3c8c1]/40 bg-white shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead className="border-b border-[#c3c8c1]/40 bg-[#f5f4ef] text-xs text-[#434843]">
          <tr>
            {["Name", "Contact", "Status", "Services", "Received"].map((heading) => (
              <th key={heading} scope="col" className="px-6 py-4 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#c3c8c1]/30">
          {data.leads.map((lead) => {
            const workflowStatus = deriveLeadWorkflowStatus(lead);
            return (
              <tr key={lead.id} className="transition-colors hover:bg-[#f5f4ef]/70">
                <td className="whitespace-nowrap px-6 py-4 font-bold">
                  <Link href={`/admin/leads/${lead.id}`} className="text-[#1b1c19] hover:underline">
                    {lead.firstName} {lead.lastName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-[13px] text-[#434843]">
                  <a href={`mailto:${lead.email}`} className="block hover:underline">
                    {lead.email}
                  </a>
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="block hover:underline">
                      {lead.phone}
                    </a>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-xs tracking-wider uppercase">
                  {leadWorkflowStatusLabel(workflowStatus)}
                </td>
                <td className="px-6 py-4 text-[13px] tracking-wide text-[#434843] uppercase">
                  {lead.requestedServices
                    .map(({ serviceType }) => serviceType.replaceAll("_", " "))
                    .join(", ")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[13px] text-[#434843]">
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                    new Date(lead.createdAt),
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
