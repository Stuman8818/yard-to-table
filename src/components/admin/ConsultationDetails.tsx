"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import {
  ConsultationDetailsDocument,
  UpdateConsultationDocument,
  type ConsultationStatus,
} from "@/graphql/generated/graphql";
import { consultationDurations, consultationEndFromDuration } from "@/lib/consultation-durations";

const statuses = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELED",
  "NO_SHOW",
] as const satisfies readonly ConsultationStatus[];
const localValue = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export function ConsultationDetails({
  consultationId,
  canEdit,
}: {
  consultationId: string;
  canEdit: boolean;
}) {
  const { data, loading, error, refetch } = useQuery(ConsultationDetailsDocument, {
    variables: { id: consultationId },
    fetchPolicy: "network-only",
  });
  const [update, result] = useMutation(UpdateConsultationDocument);
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <p className="py-12 text-center">Loading consultation</p>;
  if (error || !data?.consultation)
    return (
      <div className="rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Consultation not found</h1>
        <p className="mt-2">It does not exist or is unavailable to your organization.</p>
      </div>
    );
  const item = data.consultation;
  async function submit(formData: FormData) {
    setMessage(null);
    const start = String(formData.get("scheduledStart"));
    const scheduledEnd = consultationEndFromDuration(start, String(formData.get("duration")));
    if (!scheduledEnd) {
      setMessage("Choose a valid start time and duration.");
      return;
    }
    try {
      await update({
        variables: {
          input: {
            consultationId,
            status: formData.get("status") as ConsultationStatus,
            scheduledStart: new Date(start).toISOString(),
            scheduledEnd,
            notes: String(formData.get("notes") ?? ""),
          },
        },
      });
      await refetch();
      setMessage("Consultation updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    }
  }
  const duration = Math.round(
    (new Date(item.scheduledEnd).getTime() - new Date(item.scheduledStart).getTime()) / 60000,
  );
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-xl border bg-white p-6">
        <h1 className="text-3xl font-bold text-[#173f32]">Consultation</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info
            label={item.customer ? "Customer" : "Lead"}
            value={
              item.customer
                ? `${item.customer.firstName} ${item.customer.lastName}`
                : item.lead
                  ? `${item.lead.firstName} ${item.lead.lastName}`
                  : "Unavailable"
            }
          />
          <Info
            label="Property"
            value={
              item.property
                ? `${item.property.addressLine1}, ${item.property.city}, ${item.property.state} ${item.property.postalCode}`
                : "Phone consultation"
            }
          />
          <Info label="Date" value={new Date(item.scheduledStart).toLocaleString()} />
          <Info label="Duration" value={`${duration} minutes`} />
          <Info label="Status" value={item.status.replaceAll("_", " ")} />
          <Info label="Creator" value={item.createdBy.name ?? item.createdBy.email} />
          <Info label="Created" value={new Date(item.createdAt).toLocaleString()} />
          <Info label="Updated" value={new Date(item.updatedAt).toLocaleString()} />
        </dl>
        {item.customer ? (
          <Link
            href={`/admin/customers/${item.customer.id}`}
            className="mt-6 inline-block font-semibold text-[#476654] hover:underline"
          >
            View customer
          </Link>
        ) : item.lead ? (
          <Link
            href={`/admin/leads/${item.lead.id}`}
            className="mt-6 inline-block font-semibold text-[#476654] hover:underline"
          >
            View lead
          </Link>
        ) : null}
      </section>
      {canEdit ? (
        <form action={submit} className="rounded-xl border bg-white p-6">
          <label className="block font-semibold">
            Status
            <select
              name="status"
              defaultValue={item.status}
              className="mt-2 w-full rounded-lg border p-2"
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block font-semibold">
            Start
            <input
              type="datetime-local"
              name="scheduledStart"
              required
              defaultValue={localValue(item.scheduledStart)}
              className="mt-2 w-full rounded-lg border p-2"
            />
          </label>
          <label className="mt-4 block font-semibold">
            Duration
            <select
              name="duration"
              required
              defaultValue={String(Math.max(30, Math.min(240, Math.round(duration / 30) * 30)))}
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
          <label className="mt-4 block font-semibold">
            Notes
            <textarea
              name="notes"
              maxLength={4000}
              rows={5}
              defaultValue={item.notes ?? ""}
              className="mt-2 w-full rounded-lg border p-2"
            />
          </label>
          <button
            disabled={result.loading}
            className="mt-4 w-full rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {result.loading ? "Saving…" : "Save changes"}
          </button>
          {message ? (
            <p role="status" className="mt-2 text-sm">
              {message}
            </p>
          ) : null}
        </form>
      ) : (
        <div className="rounded-xl border bg-white p-6">Managers have read-only access.</div>
      )}
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
