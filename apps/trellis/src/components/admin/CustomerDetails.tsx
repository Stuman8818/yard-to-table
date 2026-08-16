"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";

import { CustomerDetailsDocument, ScheduleConsultationDocument } from "@/graphql/generated/graphql";
import { consultationDurations, consultationEndFromDuration } from "@/lib/consultation-durations";

export function CustomerDetails({ customerId, canEdit }: { customerId: string; canEdit: boolean }) {
  const { data, loading, error, refetch } = useQuery(CustomerDetailsDocument, {
    variables: { id: customerId },
    ssr: false,
  });
  const [schedule, scheduleResult] = useMutation(ScheduleConsultationDocument);
  const [message, setMessage] = useState<string | null>(null);
  const [renderedAt] = useState(() => Date.now());

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
  async function submitSchedule(formData: FormData) {
    setMessage(null);
    const propertyId = formData.get("propertyId");
    const start = formData.get("scheduledStart");
    const duration = formData.get("duration");
    const notes = formData.get("notes");
    if (typeof propertyId !== "string" || typeof start !== "string" || typeof duration !== "string")
      return;
    const scheduledEnd = consultationEndFromDuration(start, duration);
    if (!scheduledEnd) {
      setMessage("Choose a valid start time and duration.");
      return;
    }
    try {
      await schedule({
        variables: {
          input: {
            customerId,
            propertyId,
            scheduledStart: new Date(start).toISOString(),
            scheduledEnd,
            notes: typeof notes === "string" ? notes : undefined,
          },
        },
      });
      await refetch();
      setMessage("Consultation scheduled.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Consultation could not be scheduled.");
    }
  }
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(customer.createdAt),
  );
  const upcomingConsultations = customer.consultations
    .filter((item) => new Date(item.scheduledEnd).getTime() >= renderedAt)
    .toSorted(
      (left, right) =>
        new Date(left.scheduledStart).getTime() - new Date(right.scheduledStart).getTime(),
    );
  const pastConsultations = customer.consultations.filter(
    (item) => new Date(item.scheduledEnd).getTime() < renderedAt,
  );
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#d8ddd4] bg-white p-6">
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
      {canEdit ? (
        <section className="rounded-xl border border-[#d8ddd4] bg-white p-6">
          <h2 className="text-xl font-bold text-[#173f32]">Schedule Consultation</h2>
          <form action={submitSchedule} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Property
              <select name="propertyId" required className="mt-2 w-full rounded-lg border p-2">
                {customer.properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.addressLine1}
                  </option>
                ))}
              </select>
            </label>
            <span />
            <label className="text-sm font-semibold">
              Start
              <input
                name="scheduledStart"
                type="datetime-local"
                required
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <label className="text-sm font-semibold">
              Duration
              <select
                name="duration"
                defaultValue="60"
                required
                className="mt-2 w-full rounded-lg border p-2"
              >
                {consultationDurations.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes < 60
                      ? `${minutes} minutes`
                      : `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold sm:col-span-2">
              Notes
              <textarea
                name="notes"
                maxLength={4000}
                rows={3}
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <button
              disabled={scheduleResult.loading || !customer.properties.length}
              className="rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              {scheduleResult.loading ? "Scheduling…" : "Schedule Consultation"}
            </button>
            {message ? (
              <p role="status" className="self-center text-sm">
                {message}
              </p>
            ) : null}
          </form>
        </section>
      ) : null}
      <section
        id="properties"
        className="scroll-mt-6 rounded-xl border border-[#d8ddd4] bg-white p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#173f32]">Consultations</h2>
          <Link
            href="/admin/consultations"
            className="font-semibold text-[#476654] hover:underline"
          >
            View all
          </Link>
        </div>
        <h3 className="mt-4 font-semibold">Upcoming</h3>
        <div className="mt-2 space-y-3">
          {upcomingConsultations.length ? (
            upcomingConsultations.map((item) => (
              <Link
                key={item.id}
                href={`/admin/consultations/${item.id}`}
                className="block rounded-lg bg-[#f7f8f4] p-4 hover:bg-[#edf1e9]"
              >
                <span className="font-semibold">
                  {new Date(item.scheduledStart).toLocaleString()}
                </span>
                <span className="ml-3 text-sm">{item.status.replaceAll("_", " ")}</span>
                <p className="mt-1 text-sm text-[#5b685f]">
                  {item.property?.addressLine1 ?? "Phone consultation"}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[#66736a]">No upcoming consultations.</p>
          )}
        </div>
        <h3 className="mt-6 font-semibold">Past</h3>
        <div className="mt-2 space-y-3">
          {pastConsultations.length ? (
            pastConsultations.map((item) => (
              <Link
                key={item.id}
                href={`/admin/consultations/${item.id}`}
                className="block rounded-lg bg-[#f7f8f4] p-4 hover:bg-[#edf1e9]"
              >
                <span className="font-semibold">
                  {new Date(item.scheduledStart).toLocaleString()}
                </span>
                <span className="ml-3 text-sm">{item.status.replaceAll("_", " ")}</span>
                <p className="mt-1 text-sm text-[#5b685f]">
                  {item.property?.addressLine1 ?? "Phone consultation"}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[#66736a]">No past consultations.</p>
          )}
        </div>
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
