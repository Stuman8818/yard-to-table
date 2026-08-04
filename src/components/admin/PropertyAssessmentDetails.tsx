"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import {
  AssessmentDetailsDocument,
  CompletePropertyAssessmentDocument,
  UpdatePropertyAssessmentDocument,
} from "@/graphql/generated/graphql";
import { AssessmentInputs } from "./PropertyAssessmentForm";

const numberOrUndefined = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "");
  return text ? Number(text) : undefined;
};

export function PropertyAssessmentDetails({
  assessmentId,
  canEdit,
}: {
  assessmentId: string;
  canEdit: boolean;
}) {
  const { data, loading, error, refetch } = useQuery(AssessmentDetailsDocument, {
    variables: { id: assessmentId },
    fetchPolicy: "network-only",
  });
  const [update, updateResult] = useMutation(UpdatePropertyAssessmentDocument);
  const [complete, completeResult] = useMutation(CompletePropertyAssessmentDocument);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  if (loading) return <p className="py-12 text-center">Loading assessment</p>;
  if (error || !data?.assessment)
    return <div className="rounded-xl bg-white p-8">Assessment not found or unavailable.</div>;
  const item = data.assessment;
  const completed = item.status === "COMPLETED";
  const values = {
    requestedWork: item.requestedWork,
    generalNotes: item.generalNotes,
    accessDifficulty: item.accessDifficulty,
    estimatedLaborHours: item.estimatedLaborHours,
    recommendedCrewSize: item.recommendedCrewSize,
    materialsNeeded: item.materialsNeeded,
    equipmentNeeded: item.equipmentNeeded,
    disposalNeeded: item.disposalNeeded,
  };

  async function save(formData: FormData) {
    setMessage(null);
    try {
      await update({
        variables: {
          input: {
            assessmentId,
            requestedWork: String(formData.get("requestedWork") ?? ""),
            generalNotes: String(formData.get("generalNotes") ?? ""),
            accessDifficulty: String(formData.get("accessDifficulty") ?? ""),
            estimatedLaborHours: numberOrUndefined(formData.get("estimatedLaborHours")),
            recommendedCrewSize: numberOrUndefined(formData.get("recommendedCrewSize")),
            materialsNeeded: String(formData.get("materialsNeeded") ?? ""),
            equipmentNeeded: String(formData.get("equipmentNeeded") ?? ""),
            disposalNeeded: String(formData.get("disposalNeeded") ?? ""),
          },
        },
      });
      await refetch();
      setEditing(false);
      setMessage("Assessment updated.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Assessment could not be updated.");
    }
  }
  async function markComplete() {
    setMessage(null);
    try {
      await complete({ variables: { assessmentId } });
      await refetch();
      setMessage("Assessment completed.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Assessment could not be completed.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <section className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#173f32]">Property assessment</h1>
          {canEdit && completed && !editing ? (
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setEditing(true);
              }}
              className="rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Edit Assessment
            </button>
          ) : null}
        </div>
        <p className="mt-2 font-semibold">Status: {item.status.replaceAll("_", " ")}</p>
        <dl className="mt-6 grid gap-4">
          <Info label="Lead" value={`${item.lead.firstName} ${item.lead.lastName}`} />
          <Info
            label="Property"
            value={`${item.property.addressLine1}, ${item.property.city}, ${item.property.state} ${item.property.postalCode}`}
          />
          <Info
            label="Consultation"
            value={new Date(item.consultation.scheduledStart).toLocaleString()}
          />
          <Info
            label="Requested services"
            value={item.lead.requestedServices
              .map((service) => service.serviceType.replaceAll("_", " "))
              .join(", ")}
          />
          <Info label="Created" value={new Date(item.createdAt).toLocaleString()} />
          <Info
            label="Completed"
            value={item.completedAt ? new Date(item.completedAt).toLocaleString() : "Not completed"}
          />
        </dl>
        <div className="mt-6 grid gap-2">
          <Link
            href={`/admin/leads/${item.lead.id}`}
            className="font-semibold text-[#476654] hover:underline"
          >
            View Lead
          </Link>
          <Link
            href={`/admin/consultations/${item.consultation.id}`}
            className="font-semibold text-[#476654] hover:underline"
          >
            View Consultation
          </Link>
        </div>
        {completed ? (
          <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
            Assessment completed and preserved for future estimate creation.
          </p>
        ) : null}
      </section>
      {canEdit && (!completed || editing) ? (
        <form action={save} className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Edit assessment</h2>
          <AssessmentInputs values={values} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              disabled={updateResult.loading}
              className="rounded-lg bg-[#476654] px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {updateResult.loading ? "Saving..." : "Save Changes"}
            </button>
            {completed ? (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border px-4 py-3 font-semibold"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                disabled={completeResult.loading}
                onClick={markComplete}
                className="rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                {completeResult.loading ? "Completing..." : "Mark Assessment Completed"}
              </button>
            )}
          </div>
          {message ? (
            <p role="status" className="mt-3 text-sm">
              {message}
            </p>
          ) : null}
        </form>
      ) : (
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Assessment details</h2>
          <div className="mt-5 grid gap-4">
            {Object.entries(values).map(([name, value]) => (
              <Info
                key={name}
                label={name.replaceAll(/([A-Z])/g, " $1")}
                value={value == null || value === "" ? "Not recorded" : String(value)}
              />
            ))}
          </div>
          {message ? (
            <p role="status" className="mt-3 text-sm">
              {message}
            </p>
          ) : null}
        </section>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
