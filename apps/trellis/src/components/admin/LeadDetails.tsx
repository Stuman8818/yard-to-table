"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AddLeadNoteDocument,
  ConvertLeadToCustomerDocument,
  LeadDetailsDocument,
  UndoLeadConversionDocument,
  UpdateLeadStatusDocument,
  type LeadStatus,
} from "@/graphql/generated/graphql";
import { propertyAssessmentCardState } from "@/lib/property-assessment-card";
import { deriveLeadWorkflowStatus, leadWorkflowStatusLabel } from "@/lib/lead-workflow";

const leadStatuses = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "ESTIMATE_SENT",
  "LOST",
] as const satisfies readonly LeadStatus[];

export function LeadDetails({ leadId, canEdit }: { leadId: string; canEdit: boolean }) {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(LeadDetailsDocument, {
    variables: { id: leadId },
    ssr: false,
    fetchPolicy: "network-only",
  });
  const [updateStatus, statusResult] = useMutation(UpdateLeadStatusDocument);
  const [addNote, noteResult] = useMutation(AddLeadNoteDocument);
  const [convertLead, convertResult] = useMutation(ConvertLeadToCustomerDocument);
  const [undoConversion, undoResult] = useMutation(UndoLeadConversionDocument);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [noteMessage, setNoteMessage] = useState<string | null>(null);
  const [conversionMessage, setConversionMessage] = useState<string | null>(null);

  if (loading) return <p className="py-12 text-center">Loading lead</p>;
  if (error || !data?.lead)
    return (
      <div className="rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Lead not found</h1>
        <p className="mt-2 text-[#5b685f]">
          This lead does not exist or is unavailable to your organization.
        </p>
      </div>
    );
  const lead = data.lead;
  const workflowStatus = deriveLeadWorkflowStatus(lead);
  const activeConsultation = lead.consultations.find((item) => item.status === "SCHEDULED");
  const completedConsultation = lead.consultations.find((item) => item.status === "COMPLETED");
  const assessmentCard = propertyAssessmentCardState(
    completedConsultation?.outcome,
    completedConsultation?.assessment,
  );
  const assessmentCompleted =
    assessmentCard?.kind === "VIEW" && assessmentCard.assessment.status === "COMPLETED";
  const showLegacyWorkflowCards: boolean = false;
  const date = (value: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(value),
    );

  async function submitStatus(formData: FormData) {
    setStatusMessage(null);
    const requestedStatus = formData.get("status");
    const status = leadStatuses.find((value) => value === requestedStatus);
    if (!status) {
      setStatusMessage("Choose a valid status.");
      return;
    }
    try {
      await updateStatus({ variables: { leadId, status } });
      await refetch();
      setStatusMessage("Status updated.");
    } catch {
      setStatusMessage("Status could not be updated.");
    }
  }

  async function submitNote(formData: FormData) {
    setNoteMessage(null);
    const content = formData.get("content");
    if (typeof content !== "string" || !content.trim()) {
      setNoteMessage("Enter a note.");
      return;
    }
    try {
      await addNote({ variables: { leadId, content } });
      await refetch();
      setNoteMessage("Note added.");
    } catch {
      setNoteMessage("Note could not be added.");
    }
  }

  async function submitConversion() {
    setConversionMessage(null);
    try {
      const result = await convertLead({ variables: { leadId } });
      const customerId = result.data?.convertLeadToCustomer.id;
      if (!customerId) throw new Error("Customer was not returned.");
      await refetch();
      router.push(`/admin/customers/${customerId}`);
    } catch {
      setConversionMessage("This lead could not be converted. Please try again.");
    }
  }

  async function submitUndoConversion() {
    if (
      !window.confirm(
        "Undo this conversion? The customer and property created from this lead will be deleted.",
      )
    ) {
      return;
    }
    setConversionMessage(null);
    try {
      await undoConversion({ variables: { leadId } });
      await refetch();
      setConversionMessage("Conversion undone.");
    } catch {
      setConversionMessage("The conversion could not be undone.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-xl border border-[#d8ddd4] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#173f32]">
                {lead.firstName} {lead.lastName}
              </h1>
              <p className="mt-2 text-[#5b685f]">Created {date(lead.createdAt)}</p>
            </div>
            <span className="rounded-full bg-[#edf1e9] px-3 py-1 text-sm font-semibold">
              {leadWorkflowStatusLabel(workflowStatus)}
            </span>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Email" value={lead.email} />
            <Info label="Phone" value={lead.phone ?? "Not provided"} />
            <Info
              label="Address"
              value={[
                lead.addressLine1,
                lead.addressLine2,
                `${lead.city}, ${lead.state} ${lead.postalCode}`,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <Info
              label="Services"
              value={lead.requestedServices
                .map((service) => service.serviceType.replaceAll("_", " "))
                .join(", ")}
            />
            <Info label="Last updated" value={date(lead.updatedAt)} />
          </dl>
          {lead.notes ? (
            <div className="mt-6 border-t border-[#e5e9e2] pt-5">
              <h2 className="font-semibold">Public submission notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-[#4c5c52]">{lead.notes}</p>
            </div>
          ) : null}
        </section>
        <section className="rounded-xl border border-[#d8ddd4] bg-white p-6">
          <h2 className="text-xl font-bold text-[#173f32]">Internal notes</h2>
          {canEdit ? (
            <form action={submitNote} className="mt-4">
              <label htmlFor="content" className="block text-sm font-semibold">
                Add a note
              </label>
              <textarea
                id="content"
                name="content"
                required
                maxLength={2000}
                rows={4}
                className="mt-2 w-full rounded-lg border border-[#c8d1c7] p-3"
              />
              <button
                disabled={noteResult.loading}
                className="mt-3 rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                {noteResult.loading ? "Addingâ€¦" : "Add note"}
              </button>
              {noteMessage ? (
                <p role="status" className="mt-2 text-sm">
                  {noteMessage}
                </p>
              ) : null}
            </form>
          ) : null}
          <div className="mt-6 space-y-4">
            {lead.internalNotes.length ? (
              lead.internalNotes.map((note) => (
                <article key={note.id} className="rounded-lg bg-[#f7f8f4] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="whitespace-pre-wrap">{note.content}</p>
                    {note.content === "Consultation cancelled." ? (
                      <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        Consultation cancelled
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs text-[#66736a]">
                    {note.author.name ?? note.author.email} · {date(note.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-[#66736a]">No internal notes yet.</p>
            )}
          </div>
        </section>
      </div>
      <aside className="space-y-6">
        <WorkflowCard
          title="Schedule consultation"
          state={
            completedConsultation ? "completed" : activeConsultation ? "active" : "not started"
          }
          description={
            completedConsultation
              ? "Consultation completed."
              : activeConsultation
                ? `${activeConsultation.type.replaceAll("_", " ")} · ${date(activeConsultation.scheduledStart)}`
                : "Schedule time to learn more about the property and requested work."
          }
        >
          {completedConsultation ? (
            <WorkflowLink href={`/admin/consultations/${completedConsultation.id}`} completed>
              View Consultation
            </WorkflowLink>
          ) : activeConsultation ? (
            <WorkflowLink href={`/admin/consultations/${activeConsultation.id}`}>
              View Consultation
            </WorkflowLink>
          ) : canEdit ? (
            <WorkflowLink href={`/admin/leads/${lead.id}/consultation`}>
              Schedule Consultation
            </WorkflowLink>
          ) : null}
        </WorkflowCard>

        <WorkflowCard
          title="Property assessment"
          state={
            assessmentCompleted
              ? "completed"
              : assessmentCard?.kind === "VIEW"
                ? "active"
                : "not started"
          }
          description={
            assessmentCard?.kind === "VIEW"
              ? `Status: ${assessmentCard.assessment.status.replaceAll("_", " ")}`
              : completedConsultation
                ? "Record property conditions, labor, materials, and equipment."
                : "Complete an on-site consultation first to establish the property record."
          }
        >
          {assessmentCard?.kind === "VIEW" ? (
            <WorkflowLink
              href={`/admin/assessments/${assessmentCard.assessment.id}`}
              completed={assessmentCompleted}
            >
              View Assessment
            </WorkflowLink>
          ) : completedConsultation && canEdit ? (
            <WorkflowLink
              href={`/admin/assessments/new?consultationId=${completedConsultation.id}`}
            >
              Start Property Assessment
            </WorkflowLink>
          ) : canEdit ? (
            <WorkflowLink href={`/admin/leads/${lead.id}/consultation`}>
              Set Up Property Visit
            </WorkflowLink>
          ) : null}
        </WorkflowCard>

        <WorkflowCard
          title="Start estimate"
          state={
            lead.estimate?.status === "COMPLETED"
              ? "completed"
              : lead.estimate
                ? "active"
                : "not started"
          }
          description={
            lead.estimate
              ? `Status: ${lead.estimate.status}`
              : "Create a service breakdown and price the proposed work at any time."
          }
        >
          {lead.estimate ? (
            <WorkflowLink
              href={`/admin/estimates/${lead.estimate.id}`}
              completed={lead.estimate.status === "COMPLETED"}
            >
              View Estimate
            </WorkflowLink>
          ) : canEdit ? (
            <WorkflowLink href={`/admin/estimates/new?leadId=${lead.id}`}>
              Start Estimate
            </WorkflowLink>
          ) : null}
        </WorkflowCard>

        <WorkflowCard
          title="Convert to customer"
          state={lead.convertedCustomer ? "completed" : "not started"}
          description={
            lead.convertedCustomer
              ? "Customer and property records have been created."
              : "Convert this lead whenever the customer is ready to move forward."
          }
        >
          {lead.convertedCustomer ? (
            <>
              <WorkflowLink href={`/admin/customers/${lead.convertedCustomer.id}`} completed>
                View Customer
              </WorkflowLink>
              {canEdit ? (
                <form action={submitUndoConversion} className="mt-3 text-center">
                  <button
                    disabled={undoResult.loading}
                    className="text-sm font-semibold text-emerald-800 hover:underline"
                  >
                    Undo conversion
                  </button>
                </form>
              ) : null}
            </>
          ) : canEdit ? (
            <form action={submitConversion}>
              <button
                disabled={convertResult.loading}
                className="mt-4 w-full rounded-lg bg-[#476654] px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                {convertResult.loading ? "Converting..." : "Convert to Customer"}
              </button>
            </form>
          ) : null}
          {conversionMessage ? (
            <p role="status" className="mt-2 text-sm">
              {conversionMessage}
            </p>
          ) : null}
        </WorkflowCard>

        {showLegacyWorkflowCards &&
          (lead.convertedCustomer ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-emerald-950">Customer converted</h2>
                {canEdit ? (
                  <form action={submitUndoConversion}>
                    <button
                      type="submit"
                      disabled={undoResult.loading}
                      aria-label="Undo customer conversion"
                      title="Undo customer conversion"
                      className="inline-flex size-9 items-center justify-center rounded-full border border-emerald-700 text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7 4 12l5 5" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h9a5 5 0 0 1 5 5"
                        />
                      </svg>
                    </button>
                  </form>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-emerald-800">
                This lead now has a customer and property record.
              </p>
              <Link
                href={`/admin/customers/${lead.convertedCustomer.id}`}
                className="mt-4 block w-full rounded-lg bg-emerald-700 px-4 py-2 text-center font-semibold text-white hover:bg-emerald-800"
              >
                View Customer
              </Link>
              <Link
                href={`/admin/customers/${lead.convertedCustomer.id}#properties`}
                className="mt-3 block text-center text-sm font-semibold text-emerald-800 hover:underline"
              >
                View Properties
              </Link>
            </div>
          ) : activeConsultation ? (
            <div className="rounded-xl border border-[#b7d36b] bg-white p-6">
              <h2 className="font-semibold text-[#173f32]">Upcoming consultation</h2>
              <p className="mt-2 text-sm text-[#5b685f]">
                {activeConsultation.type.replaceAll("_", " ")} ·{" "}
                {date(activeConsultation.scheduledStart)} · {activeConsultation.status}
              </p>
              <Link
                href={`/admin/consultations/${activeConsultation.id}`}
                className="mt-4 block rounded-lg bg-[#476654] px-4 py-2 text-center font-semibold text-white"
              >
                View Consultation
              </Link>
              <Link
                href={`/admin/consultations/${activeConsultation.id}`}
                className="mt-3 block text-center text-sm font-semibold text-[#476654] hover:underline"
              >
                Reschedule or cancel
              </Link>
            </div>
          ) : completedConsultation ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
              <h2 className="font-semibold text-emerald-950">Consultation completed</h2>
              {completedConsultation.outcome ? (
                <p className="mt-2 text-sm text-emerald-800">
                  Outcome: {completedConsultation.outcome.replaceAll("_", " ")}
                </p>
              ) : null}
              <Link
                href={`/admin/consultations/${completedConsultation.id}`}
                className="mt-4 block rounded-lg bg-emerald-700 px-4 py-2 text-center font-semibold text-white"
              >
                View Consultation
              </Link>
            </div>
          ) : canEdit ? (
            <div className="rounded-xl border border-[#b7d36b] bg-white p-6">
              <h2 className="font-semibold text-[#173f32]">Next step</h2>
              <p className="mt-2 text-sm text-[#5b685f]">
                Schedule a consultation to learn more about the property and requested work.
              </p>
              <Link
                href={`/admin/leads/${lead.id}/consultation`}
                className="mt-4 block rounded-lg bg-[#476654] px-4 py-2 text-center font-semibold text-white"
              >
                Schedule Consultation
              </Link>
            </div>
          ) : null)}
        {showLegacyWorkflowCards && completedConsultation && assessmentCard ? (
          <div
            className={
              assessmentCompleted
                ? "rounded-xl border border-emerald-300 bg-emerald-50 p-6"
                : "rounded-xl border border-[#b7d36b] bg-white p-6"
            }
          >
            {assessmentCard.kind === "VIEW" ? (
              <>
                <h2
                  className={`font-semibold ${assessmentCompleted ? "text-emerald-950" : "text-[#173f32]"}`}
                >
                  Property assessment
                </h2>
                <p
                  className={`mt-2 text-sm ${assessmentCompleted ? "text-emerald-800" : "text-[#5b685f]"}`}
                >
                  Status: {assessmentCard.assessment.status.replaceAll("_", " ")}
                </p>
                <Link
                  href={`/admin/assessments/${assessmentCard.assessment.id}`}
                  className={`mt-4 block rounded-lg px-4 py-2 text-center font-semibold text-white ${assessmentCompleted ? "bg-emerald-700 hover:bg-emerald-800" : "bg-[#476654]"}`}
                >
                  View Assessment
                </Link>
                {assessmentCard.assessment.status === "COMPLETED" ? (
                  <p className="mt-3 text-sm text-emerald-800">
                    Assessment completed and ready for a future estimate workflow.
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <h2 className="font-semibold text-[#173f32]">Ready for property assessment</h2>
                <p className="mt-2 text-sm text-[#5b685f]">
                  Record the property conditions, measurements, labor needs, and materials required
                  for this work.
                </p>
                {canEdit ? (
                  <Link
                    href={`/admin/assessments/new?consultationId=${completedConsultation.id}`}
                    className="mt-4 block rounded-lg bg-[#476654] px-4 py-2 text-center font-semibold text-white"
                  >
                    Start Property Assessment
                  </Link>
                ) : null}
              </>
            )}
          </div>
        ) : null}
        {showLegacyWorkflowCards && lead.estimate ? (
          <div
            className={
              lead.estimate?.status === "COMPLETED"
                ? "rounded-xl border border-emerald-300 bg-emerald-50 p-6"
                : "rounded-xl border border-[#b7d36b] bg-white p-6"
            }
          >
            <h2
              className={`font-semibold ${lead.estimate?.status === "COMPLETED" ? "text-emerald-950" : "text-[#173f32]"}`}
            >
              Estimate
            </h2>
            <p
              className={`mt-2 text-sm ${lead.estimate?.status === "COMPLETED" ? "text-emerald-800" : "text-[#5b685f]"}`}
            >
              {lead.estimate
                ? `Status: ${lead.estimate.status}`
                : "Create a service breakdown and price the proposed landscaping work."}
            </p>
            {lead.estimate ? (
              <Link
                href={`/admin/estimates/${lead.estimate.id}`}
                className={`mt-4 block rounded-lg px-4 py-2 text-center font-semibold text-white ${lead.estimate.status === "COMPLETED" ? "bg-emerald-700 hover:bg-emerald-800" : "bg-[#476654]"}`}
              >
                View Estimate
              </Link>
            ) : canEdit ? (
              <Link
                href={`/admin/estimates/new?leadId=${lead.id}`}
                className="mt-4 block rounded-lg bg-[#476654] px-4 py-2 text-center font-semibold text-white"
              >
                Start Estimate
              </Link>
            ) : null}
          </div>
        ) : null}
        {showLegacyWorkflowCards && !lead.convertedCustomer && canEdit ? (
          <div className="text-center">
            <form action={submitConversion}>
              <button
                disabled={convertResult.loading}
                className="text-sm font-semibold text-[#5b685f] hover:underline"
              >
                {convertResult.loading ? "Converting…" : "Convert manually"}
              </button>
            </form>
            {conversionMessage ? (
              <p role="status" className="mt-2 text-sm text-[#5b685f]">
                {conversionMessage}
              </p>
            ) : null}
          </div>
        ) : null}
        {canEdit &&
        lead.status !== "CONVERTED" &&
        lead.status !== "CONSULTATION_COMPLETED" &&
        lead.status !== "ASSESSMENT_COMPLETED" &&
        lead.status !== "ESTIMATE_COMPLETED" ? (
          <form action={submitStatus} className="rounded-xl border border-[#d8ddd4] bg-white p-6">
            <label htmlFor="lead-status" className="block font-semibold">
              Lead status
            </label>
            <select
              id="lead-status"
              name="status"
              defaultValue={lead.status}
              className="mt-3 w-full rounded-lg border border-[#c8d1c7] px-3 py-2"
            >
              {leadStatuses.map((value) => (
                <option key={value} value={value}>
                  {value.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <button
              disabled={statusResult.loading}
              className="mt-3 w-full rounded-lg bg-[#173f32] px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {statusResult.loading ? "Savingâ€¦" : "Update status"}
            </button>
            {statusMessage ? (
              <p role="status" className="mt-2 text-sm">
                {statusMessage}
              </p>
            ) : null}
          </form>
        ) : lead.status === "CONVERTED" ||
          lead.status === "CONSULTATION_COMPLETED" ||
          lead.status === "ASSESSMENT_COMPLETED" ||
          lead.status === "ESTIMATE_COMPLETED" ? (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-sm text-emerald-900">
            This status is managed by its dedicated workflow.
          </div>
        ) : (
          <div className="rounded-xl border border-[#d8ddd4] bg-white p-6 text-sm text-[#5b685f]">
            Managers have read-only access.
          </div>
        )}
      </aside>
    </div>
  );
}

function WorkflowCard({
  title,
  state,
  description,
  children,
}: {
  title: string;
  state: "not started" | "active" | "completed";
  description: string;
  children: React.ReactNode;
}) {
  const completed = state === "completed";
  return (
    <section
      className={
        completed
          ? "rounded-xl border border-emerald-300 bg-emerald-50 p-6"
          : "rounded-xl border border-[#b7c8b5] bg-white p-6"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <h2
          className={completed ? "font-semibold text-emerald-950" : "font-semibold text-[#173f32]"}
        >
          {title}
        </h2>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${
            completed
              ? "bg-emerald-200 text-emerald-900"
              : state === "active"
                ? "bg-[#e3edd4] text-[#35503f]"
                : "bg-[#edf0ea] text-[#65736a]"
          }`}
        >
          {state}
        </span>
      </div>
      <p className={`mt-2 text-sm ${completed ? "text-emerald-800" : "text-[#5b685f]"}`}>
        {description}
      </p>
      {children}
    </section>
  );
}

function WorkflowLink({
  href,
  completed = false,
  children,
}: {
  href: string;
  completed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`mt-4 block rounded-lg px-4 py-2 text-center font-semibold text-white ${
        completed ? "bg-emerald-700 hover:bg-emerald-800" : "bg-[#476654] hover:bg-[#395344]"
      }`}
    >
      {children}
    </Link>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">{label}</dt>
      <dd className="mt-1 text-[#25372d]">{value}</dd>
    </div>
  );
}
