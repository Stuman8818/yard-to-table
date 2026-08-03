"use client";

import { useQuery } from "@apollo/client/react";

import { LeadsDocument } from "@/graphql/generated/graphql";

export function AdminLeads() {
  const { data, loading, error } = useQuery(LeadsDocument, { ssr: false });

  if (loading) return <p className="py-12 text-center text-[#5b685f]">Loading leadsâ€¦</p>;
  if (error) {
    return (
      <p role="alert" className="rounded-xl bg-[#fbe8e4] p-5 text-[#7d2d22]">
        Leads could not be loaded. Please try again.
      </p>
    );
  }
  if (!data?.leads.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#b8c5bb] bg-white p-10 text-center">
        <h2 className="font-semibold text-[#173f32]">No leads yet</h2>
        <p className="mt-2 text-sm text-[#5b685f]">New service requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#d8ddd4] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#d8ddd4] text-left text-sm">
        <thead className="bg-[#edf1e9] text-[#35483d]">
          <tr>
            {["Name", "Contact", "Status", "Services", "Received"].map((heading) => (
              <th key={heading} scope="col" className="px-5 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e9e2]">
          {data.leads.map((lead) => (
            <tr key={lead.id}>
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#173f32]">
                {lead.firstName} {lead.lastName}
              </td>
              <td className="px-5 py-4 text-[#4c5c52]">
                <a href={`mailto:${lead.email}`} className="block hover:underline">
                  {lead.email}
                </a>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="block hover:underline">
                    {lead.phone}
                  </a>
                ) : null}
              </td>
              <td className="px-5 py-4">{lead.status.replaceAll("_", " ")}</td>
              <td className="px-5 py-4">
                {lead.requestedServices
                  .map(({ serviceType }) => serviceType.replaceAll("_", " "))
                  .join(", ")}
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(lead.createdAt),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
