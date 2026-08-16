"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import {
  CompleteConsultationDocument,
  ConsultationDetailsDocument,
  MarkConsultationLeadLostDocument,
  ScheduleLeadConsultationDocument,
  UpdateConsultationDocument,
  type ConsultationOutcome,
  type ConsultationStatus,
} from "@/graphql/generated/graphql";
import { consultationDurations, consultationEndFromDuration } from "@/lib/consultation-durations";
import { consultationOutcomeGuidance } from "@/lib/consultation-outcomes";

const editableStatuses = [
  "SCHEDULED",
  "CANCELED",
  "NO_SHOW",
] as const satisfies readonly ConsultationStatus[];
const outcomes = [
  "ASSESSMENT_NEEDED",
  "READY_FOR_ESTIMATE",
  "FOLLOW_UP_NEEDED",
  "NOT_A_GOOD_FIT",
  "CUSTOMER_NOT_INTERESTED",
] as const satisfies readonly ConsultationOutcome[];
const localValue = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const label = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (letter) => letter.toUpperCase());

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
  const [update, updateResult] = useMutation(UpdateConsultationDocument);
  const [complete, completeResult] = useMutation(CompleteConsultationDocument);
  const [scheduleFollowUp, followUpResult] = useMutation(ScheduleLeadConsultationDocument);
  const [markLost, lostResult] = useMutation(MarkConsultationLeadLostDocument);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showLost, setShowLost] = useState(false);
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
  const duration = Math.round(
    (new Date(item.scheduledEnd).getTime() - new Date(item.scheduledStart).getTime()) / 60000,
  );

  async function submitUpdate(formData: FormData) {
    setMessage(null);
    const start = String(formData.get("scheduledStart"));
    const scheduledEnd = consultationEndFromDuration(start, String(formData.get("duration")));
    if (!scheduledEnd) return setMessage("Choose a valid start time and duration.");
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
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Update failed.");
    }
  }

  async function submitCompletion(formData: FormData) {
    setMessage(null);
    const actualDurationValue = String(formData.get("actualDuration") ?? "");
    try {
      await complete({
        variables: {
          input: {
            consultationId,
            outcome: formData.get("outcome") as ConsultationOutcome,
            completionNotes: String(formData.get("completionNotes") ?? ""),
            ...(actualDurationValue ? { actualDuration: Number(actualDurationValue) } : {}),
          },
        },
      });
      setShowCompletion(false);
      await refetch();
      setMessage("Consultation completed.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Completion failed.");
    }
  }

  async function submitFollowUp(formData: FormData) {
    if (!item.lead) return;
    setMessage(null);
    const start = String(formData.get("scheduledStart"));
    const scheduledEnd = consultationEndFromDuration(start, String(formData.get("duration")));
    if (!scheduledEnd) return setMessage("Choose a valid start time and duration.");
    try {
      await scheduleFollowUp({
        variables: {
          input: {
            leadId: item.lead.id,
            type: item.type,
            scheduledStart: new Date(start).toISOString(),
            scheduledEnd,
            notes: String(formData.get("notes") ?? ""),
            ...(item.type === "ON_SITE" && item.property
              ? {
                  addressLine1: item.property.addressLine1,
                  addressLine2: item.property.addressLine2 ?? "",
                  city: item.property.city,
                  state: item.property.state,
                  postalCode: item.property.postalCode,
                }
              : {}),
          },
        },
      });
      setShowFollowUp(false);
      await refetch();
      setMessage("Follow-up scheduled as a new consultation.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Follow-up could not be scheduled.");
    }
  }

  async function submitLost(formData: FormData) {
    setMessage(null);
    try {
      await markLost({
        variables: { input: { consultationId, reason: String(formData.get("reason") ?? "") } },
      });
      setShowLost(false);
      setMessage("Lead marked lost.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Lead could not be updated.");
    }
  }

  const completed = item.status === "COMPLETED";
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-xl border bg-white p-6">
        <h1 className="text-3xl font-bold text-[#173f32]">
          {completed ? "Consultation completed" : "Consultation"}
        </h1>
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
          <Info label="Scheduled" value={new Date(item.scheduledStart).toLocaleString()} />
          <Info label="Expected duration" value={`${duration} minutes`} />
          {completed ? (
            <>
              <Info
                label="Completed"
                value={
                  item.completedAt ? new Date(item.completedAt).toLocaleString() : "Not recorded"
                }
              />
              <Info
                label="Completed by"
                value={item.completedBy?.name ?? item.completedBy?.email ?? "Not recorded"}
              />
              <Info label="Outcome" value={item.outcome ? label(item.outcome) : "Not recorded"} />
              <Info
                label="Actual duration"
                value={item.actualDuration ? `${item.actualDuration} minutes` : "Not recorded"}
              />
            </>
          ) : (
            <Info label="Status" value={label(item.status)} />
          )}
        </dl>
        {completed && item.completionNotes ? (
          <div className="mt-6 rounded-lg bg-[#f7f8f4] p-4">
            <h2 className="font-semibold">Completion notes</h2>
            <p className="mt-2 whitespace-pre-wrap">{item.completionNotes}</p>
          </div>
        ) : null}
      </section>

      <aside className="space-y-4">
        {completed ? (
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-bold text-[#173f32]">Next step</h2>
            <p className="mt-2 text-sm text-[#5b685f]">
              {consultationOutcomeGuidance(item.outcome)}
            </p>
            {canEdit ? (
              <div className="mt-4 grid gap-3">
                <button
                  onClick={() => setShowFollowUp(true)}
                  className="rounded-lg bg-[#476654] px-4 py-2 font-semibold text-white"
                >
                  Schedule Follow-up
                </button>
                <button
                  onClick={() => setShowLost(true)}
                  className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-800"
                >
                  Mark Lead Lost
                </button>
              </div>
            ) : null}
            {item.lead ? (
              <Link
                href={`/admin/leads/${item.lead.id}`}
                className="mt-4 block text-center font-semibold text-[#476654] hover:underline"
              >
                View Lead
              </Link>
            ) : null}
            {item.customer && item.property ? (
              <Link
                href={`/admin/customers/${item.customer.id}#properties`}
                className="mt-3 block text-center font-semibold text-[#476654] hover:underline"
              >
                View Property
              </Link>
            ) : null}
          </div>
        ) : canEdit ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowCompletion(true)}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white"
            >
              Complete Consultation
            </button>
            <form action={submitUpdate} className="rounded-xl border bg-white p-6">
              <label className="block font-semibold">
                Status
                <select
                  name="status"
                  defaultValue={item.status}
                  className="mt-2 w-full rounded-lg border p-2"
                >
                  {editableStatuses.map((status) => (
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
              <DurationSelect value={duration} />
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
                disabled={updateResult.loading}
                className="mt-4 w-full rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {updateResult.loading ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-6">Managers have read-only access.</div>
        )}

        {showCompletion ? (
          <form
            action={submitCompletion}
            role="dialog"
            aria-modal="true"
            aria-labelledby="complete-title"
            className="rounded-xl border-2 border-emerald-600 bg-white p-6 shadow-lg"
          >
            <h2 id="complete-title" className="text-xl font-bold">
              Complete consultation
            </h2>
            <label className="mt-4 block font-semibold">
              Outcome
              <select
                name="outcome"
                required
                defaultValue=""
                className="mt-2 w-full rounded-lg border p-2"
              >
                <option value="" disabled>
                  Choose an outcome
                </option>
                {outcomes.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {label(outcome)}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block font-semibold">
              Actual duration (minutes)
              <input
                name="actualDuration"
                type="number"
                min="1"
                max="1440"
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <label className="mt-4 block font-semibold">
              Completion notes
              <textarea
                name="completionNotes"
                maxLength={4000}
                rows={4}
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <div className="mt-4 flex gap-3">
              <button
                disabled={completeResult.loading}
                className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {completeResult.loading ? "Completing..." : "Confirm completion"}
              </button>
              <button
                type="button"
                onClick={() => setShowCompletion(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {showFollowUp && item.lead ? (
          <form
            action={submitFollowUp}
            role="dialog"
            aria-modal="true"
            aria-labelledby="follow-up-title"
            className="rounded-xl border-2 border-[#476654] bg-white p-6 shadow-lg"
          >
            <h2 id="follow-up-title" className="text-xl font-bold">
              Schedule follow-up
            </h2>
            <label className="mt-4 block font-semibold">
              Start
              <input
                type="datetime-local"
                name="scheduledStart"
                required
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <DurationSelect value={item.actualDuration ?? duration} />
            <label className="mt-4 block font-semibold">
              Purpose and preparation notes
              <textarea
                name="notes"
                maxLength={4000}
                rows={4}
                defaultValue={item.completionNotes ?? item.notes ?? ""}
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <div className="mt-4 flex gap-3">
              <button
                disabled={followUpResult.loading}
                className="rounded-lg bg-[#476654] px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {followUpResult.loading ? "Scheduling..." : "Schedule follow-up"}
              </button>
              <button
                type="button"
                onClick={() => setShowFollowUp(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {showLost ? (
          <form
            action={submitLost}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lost-title"
            className="rounded-xl border-2 border-red-500 bg-white p-6 shadow-lg"
          >
            <h2 id="lost-title" className="text-xl font-bold">
              Mark lead lost
            </h2>
            <label className="mt-4 block font-semibold">
              Loss reason
              <textarea
                name="reason"
                required
                maxLength={1000}
                rows={3}
                className="mt-2 w-full rounded-lg border p-2"
              />
            </label>
            <div className="mt-4 flex gap-3">
              <button
                disabled={lostResult.loading}
                className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {lostResult.loading ? "Saving..." : "Mark lost"}
              </button>
              <button
                type="button"
                onClick={() => setShowLost(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {message ? (
          <p role="status" className="rounded-lg bg-white p-3 text-sm">
            {message}
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function DurationSelect({ value }: { value: number }) {
  return (
    <label className="mt-4 block font-semibold">
      Duration
      <select
        name="duration"
        required
        defaultValue={String(Math.max(30, Math.min(240, Math.round(value / 30) * 30)))}
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
  );
}

function Info({ label: name, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">{name}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
