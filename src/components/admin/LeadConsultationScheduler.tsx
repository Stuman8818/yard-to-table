"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LeadDetailsDocument, ScheduleLeadConsultationDocument } from "@/graphql/generated/graphql";
import { consultationDurations, consultationEndFromDuration } from "@/lib/consultation-durations";

export function LeadConsultationScheduler({ leadId }: { leadId: string }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(LeadDetailsDocument, {
    variables: { id: leadId },
    fetchPolicy: "network-only",
  });
  const [schedule, result] = useMutation(ScheduleLeadConsultationDocument);
  const [type, setType] = useState<"ON_SITE" | "PHONE">("ON_SITE");
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <p className="py-12 text-center">Loading lead</p>;
  if (error || !data?.lead)
    return <div className="rounded-xl bg-white p-8">Lead not found or unavailable.</div>;
  const lead = data.lead;

  async function submit(formData: FormData) {
    setMessage(null);
    const start = String(formData.get("scheduledStart"));
    const scheduledEnd = consultationEndFromDuration(start, String(formData.get("duration")));
    if (!scheduledEnd) return setMessage("Choose a valid start time and duration.");
    try {
      await schedule({
        variables: {
          input: {
            leadId,
            type,
            scheduledStart: new Date(start).toISOString(),
            scheduledEnd,
            notes: String(formData.get("notes") ?? ""),
            ...(type === "ON_SITE"
              ? {
                  addressLine1: String(formData.get("addressLine1") ?? ""),
                  addressLine2: String(formData.get("addressLine2") ?? ""),
                  city: String(formData.get("city") ?? ""),
                  state: String(formData.get("state") ?? ""),
                  postalCode: String(formData.get("postalCode") ?? ""),
                }
              : {}),
          },
        },
      });
      router.push(`/admin/leads/${leadId}`);
      router.refresh();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Consultation could not be scheduled.");
    }
  }

  return (
    <form action={submit} className="mx-auto max-w-2xl rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-[#173f32]">Schedule consultation</h1>
      <p className="mt-2 text-[#5b685f]">
        {lead.firstName} {lead.lastName}
      </p>
      <label className="mt-5 block font-semibold">
        Type
        <select
          value={type}
          onChange={(event) => setType(event.target.value as "ON_SITE" | "PHONE")}
          className="mt-2 w-full rounded-lg border p-2"
        >
          <option value="ON_SITE">On-site consultation</option>
          <option value="PHONE">Phone consultation</option>
        </select>
      </label>
      <label className="mt-4 block font-semibold">
        Start
        <input
          name="scheduledStart"
          type="datetime-local"
          required
          className="mt-2 w-full rounded-lg border p-2"
        />
      </label>
      <label className="mt-4 block font-semibold">
        Duration
        <select name="duration" defaultValue="60" className="mt-2 w-full rounded-lg border p-2">
          {consultationDurations.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes < 60
                ? `${minutes} minutes`
                : `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}`}
            </option>
          ))}
        </select>
      </label>
      {type === "ON_SITE" ? (
        <fieldset className="mt-4 grid gap-3">
          <legend className="font-semibold">Property address</legend>
          <input
            name="addressLine1"
            required
            defaultValue={lead.addressLine1}
            aria-label="Address line 1"
            className="rounded-lg border p-2"
          />
          <input
            name="addressLine2"
            defaultValue={lead.addressLine2 ?? ""}
            aria-label="Address line 2"
            className="rounded-lg border p-2"
          />
          <input
            name="city"
            required
            defaultValue={lead.city}
            aria-label="City"
            className="rounded-lg border p-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="state"
              required
              defaultValue={lead.state}
              aria-label="State"
              className="rounded-lg border p-2"
            />
            <input
              name="postalCode"
              required
              defaultValue={lead.postalCode}
              aria-label="Postal code"
              className="rounded-lg border p-2"
            />
          </div>
        </fieldset>
      ) : null}
      <label className="mt-4 block font-semibold">
        Purpose or notes
        <textarea
          name="notes"
          defaultValue={lead.notes ?? ""}
          maxLength={4000}
          rows={4}
          className="mt-2 w-full rounded-lg border p-2"
        />
      </label>
      <button
        disabled={result.loading}
        className="mt-5 w-full rounded-lg bg-[#476654] px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {result.loading ? "Scheduling..." : "Schedule Consultation"}
      </button>
      {message ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {message}
        </p>
      ) : null}
    </form>
  );
}
