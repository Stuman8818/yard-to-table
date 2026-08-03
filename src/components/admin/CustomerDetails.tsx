"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { CustomerDetailsDocument } from "@/graphql/generated/graphql";

export function CustomerDetails({ customerId }: { customerId: string }) {
  const { data, loading, error } = useQuery(CustomerDetailsDocument, {
    variables: { id: customerId },
    ssr: false,
  });

  if (loading) return <p className="py-12 text-center">Loading customer</p>;
  if (error || !data?.customer) {
    return (
      <div className="rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Customer not found</h1>
        <p className="mt-2 text-[#5b685f]">
          This customer does not exist or is unavailable to your organization.
        </p>
      </div>
    );
  }

  const customer = data.customer;
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(customer.createdAt),
  );
  return (
    <div className="space-y-6">
      <section
        id="properties"
        className="scroll-mt-6 rounded-xl border border-[#d8ddd4] bg-white p-6"
      >
        <h1 className="text-3xl font-bold text-[#173f32]">
          {customer.firstName} {customer.lastName}
        </h1>
        <p className="mt-2 text-[#5b685f]">Customer since {date}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Email" value={customer.email} />
          <Info label="Phone" value={customer.phone ?? "Not provided"} />
          <Info label="Organization" value={customer.organization.name} />
          {customer.sourceLead ? (
            <div>
              <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">Source</dt>
              <dd className="mt-1">
                <Link
                  className="font-semibold text-[#476654] hover:underline"
                  href={`/admin/leads/${customer.sourceLead.id}`}
                >
                  View source lead
                </Link>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>
      <section className="rounded-xl border border-[#d8ddd4] bg-white p-6">
        <h2 className="text-xl font-bold text-[#173f32]">Properties</h2>
        <div className="mt-4 space-y-4">
          {customer.properties.map((property) => (
            <article key={property.id} className="rounded-lg bg-[#f7f8f4] p-4">
              <p>{property.addressLine1}</p>
              {property.addressLine2 ? <p>{property.addressLine2}</p> : null}
              <p>
                {property.city}, {property.state} {property.postalCode}
              </p>
              {property.accessNotes ? (
                <p className="mt-2 text-sm">Access: {property.accessNotes}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
