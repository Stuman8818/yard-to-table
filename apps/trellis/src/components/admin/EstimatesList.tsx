"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { EstimatesDocument, type EstimateStatus } from "@/graphql/generated/graphql";

export function EstimatesList({ search, status }: { search?: string; status?: EstimateStatus }) {
  const { data, loading, error } = useQuery(EstimatesDocument, { variables: { search, status } });
  if (loading) return <p className="py-12 text-center text-[#5b685f]">Loading estimates…</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-[#fbe8e4] p-5 text-[#7d2d22]">
        Estimates could not be loaded. Please try again.
      </p>
    );
  if (!data?.estimates.length)
    return (
      <div className="rounded-xl border border-dashed border-[#b8c5bb] bg-white p-10 text-center">
        <h2 className="font-semibold text-[#173f32]">No matching estimates</h2>
        <p className="mt-2 text-sm text-[#5b685f]">
          Estimates created from eligible leads will appear here.
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-[#d8ddd4] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#d8ddd4] text-left text-sm">
        <thead className="bg-[#edf1e9] text-[#35483d]">
          <tr>
            {["Customer", "Details", "Amount", "Status", "Updated"].map((heading) => (
              <th key={heading} scope="col" className="px-5 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e9e2]">
          {data.estimates.map((estimate) => (
            <tr key={estimate.id} className="hover:bg-[#fafbf8]">
              <td className="whitespace-nowrap px-5 py-4 font-semibold">
                <Link
                  href={`/admin/estimates/${estimate.id}`}
                  className="text-[#173f32] hover:underline"
                >
                  {estimate.lead.firstName} {estimate.lead.lastName}
                </Link>
                <span className="block font-normal text-[#65736a]">{estimate.lead.email}</span>
              </td>
              <td className="max-w-xs truncate px-5 py-4 text-[#4c5c52]">
                {estimate.details || "No details"}
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-semibold">
                {new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
                  estimate.totalCents / 100,
                )}
              </td>
              <td className="px-5 py-4">{estimate.status}</td>
              <td className="whitespace-nowrap px-5 py-4 text-[#4c5c52]">
                {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(estimate.updatedAt),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
