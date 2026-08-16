"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { CustomersDocument } from "@/graphql/generated/graphql";

export function CustomersList({ search }: { search?: string }) {
  const { data, loading, error } = useQuery(CustomersDocument, {
    variables: { search },
  });

  if (loading) return <p className="py-12 text-center text-[#5b685f]">Loading customers…</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-[#fbe8e4] p-5 text-[#7d2d22]">
        Customers could not be loaded. Please try again.
      </p>
    );
  if (!data?.customers.length)
    return (
      <div className="rounded-xl border border-dashed border-[#b8c5bb] bg-white p-10 text-center">
        <h2 className="font-semibold text-[#173f32]">No matching customers</h2>
        <p className="mt-2 text-sm text-[#5b685f]">Converted leads will appear here.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-[#d8ddd4] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#d8ddd4] text-left text-sm">
        <thead className="bg-[#edf1e9] text-[#35483d]">
          <tr>
            {["Customer", "Contact", "Property", "Updated"].map((heading) => (
              <th key={heading} scope="col" className="px-5 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e5e9e2]">
          {data.customers.map((customer) => {
            const property = customer.properties[0];
            return (
              <tr key={customer.id} className="hover:bg-[#fafbf8]">
                <td className="whitespace-nowrap px-5 py-4 font-semibold">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-[#173f32] hover:underline"
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-5 py-4 text-[#4c5c52]">
                  <a href={`mailto:${customer.email}`} className="block hover:underline">
                    {customer.email}
                  </a>
                  {customer.phone ? (
                    <a href={`tel:${customer.phone}`} className="block hover:underline">
                      {customer.phone}
                    </a>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-[#4c5c52]">
                  {property
                    ? `${property.addressLine1}, ${property.city}, ${property.state}`
                    : "No property"}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-[#4c5c52]">
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                    new Date(customer.updatedAt),
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
