"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ConsultationsDocument, type ConsultationScope } from "@/graphql/generated/graphql";

export function ConsultationsList({ scope }: { scope: ConsultationScope }) {
  const { data, loading, error } = useQuery(ConsultationsDocument, {
    variables: { scope },
    fetchPolicy: "network-only",
  });
  if (loading) return <p className="py-12 text-center">Loading consultations</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-white p-6">
        Consultations could not be loaded.
      </p>
    );
  if (!data?.consultations.length)
    return <p className="rounded-xl bg-white p-6">No consultations in this view.</p>;
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-left">
        <thead className="bg-[#edf1e9] text-sm">
          <tr>
            <th className="p-4">Date and time</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Property</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.consultations.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">
                <Link
                  className="font-semibold text-[#476654] hover:underline"
                  href={`/admin/consultations/${item.id}`}
                >
                  {new Date(item.scheduledStart).toLocaleString()}
                </Link>
              </td>
              <td className="p-4">
                {item.customer
                  ? `${item.customer.firstName} ${item.customer.lastName}`
                  : item.lead
                    ? `${item.lead.firstName} ${item.lead.lastName}`
                    : "Unavailable"}
              </td>
              <td className="p-4">{item.property?.addressLine1 ?? "Phone consultation"}</td>
              <td className="p-4">{item.status.replaceAll("_", " ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
