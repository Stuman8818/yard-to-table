"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AssessmentContextDocument,
  type AssessmentContextQuery,
  CreatePropertyAssessmentDocument,
} from "@/graphql/generated/graphql";

const numberOrUndefined = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "");
  return text ? Number(text) : undefined;
};

export function PropertyAssessmentForm({ consultationId }: { consultationId: string }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(AssessmentContextDocument, {
    variables: { consultationId },
    fetchPolicy: "network-only",
  });
  const [create, result] = useMutation(CreatePropertyAssessmentDocument);
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <p className="py-12 text-center">Loading assessment context</p>;
  if (error || !data?.assessmentContext)
    return (
      <div className="rounded-xl bg-white p-8">Eligible consultation and property not found.</div>
    );
  const context = data.assessmentContext;
  if (context.assessment)
    return (
      <div className="rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Property assessment already exists</h1>
        <Link
          href={`/admin/assessments/${context.assessment.id}`}
          className="mt-4 inline-block font-semibold text-[#476654] hover:underline"
        >
          View Assessment
        </Link>
      </div>
    );

  async function submit(formData: FormData) {
    setMessage(null);
    try {
      const response = await create({
        variables: {
          input: {
            consultationId,
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
      const id = response.data?.createPropertyAssessment.id;
      if (!id) throw new Error("Assessment was not returned.");
      router.push(`/admin/assessments/${id}`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Assessment could not be saved.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <AssessmentContext context={context} />
      <form action={submit} className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-[#173f32]">Property assessment</h1>
        <p className="mt-2 text-sm text-[#5b685f]">
          Save a draft now and complete it after all required work details are recorded.
        </p>
        <AssessmentInputs />
        <button
          disabled={result.loading}
          className="mt-5 w-full rounded-lg bg-[#476654] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {result.loading ? "Saving..." : "Save Draft"}
        </button>
        {message ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

export function AssessmentInputs({
  values,
}: {
  values?: Record<string, string | number | null | undefined>;
}) {
  const textareas = [
    ["requestedWork", "Requested work"],
    ["generalNotes", "General property notes"],
    ["accessDifficulty", "Access difficulty"],
    ["materialsNeeded", "Materials needed"],
    ["equipmentNeeded", "Equipment needed"],
    ["disposalNeeded", "Disposal or cleanup needs"],
  ] as const;
  return (
    <div className="mt-5 grid gap-4">
      {textareas.map(([name, label]) => (
        <label key={name} className="block font-semibold">
          {label}
          <textarea
            name={name}
            maxLength={5000}
            rows={name === "requestedWork" ? 4 : 3}
            defaultValue={String(values?.[name] ?? "")}
            className="mt-2 w-full rounded-lg border p-2"
          />
        </label>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="font-semibold">
          Estimated labor hours
          <input
            name="estimatedLaborHours"
            type="number"
            min="0.25"
            step="0.25"
            defaultValue={values?.estimatedLaborHours ?? ""}
            className="mt-2 w-full rounded-lg border p-2"
          />
        </label>
        <label className="font-semibold">
          Recommended crew size
          <input
            name="recommendedCrewSize"
            type="number"
            min="1"
            step="1"
            defaultValue={values?.recommendedCrewSize ?? ""}
            className="mt-2 w-full rounded-lg border p-2"
          />
        </label>
      </div>
    </div>
  );
}

function AssessmentContext({
  context,
}: {
  context: NonNullable<AssessmentContextQuery["assessmentContext"]>;
}) {
  if (!context) return null;
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="text-xl font-bold text-[#173f32]">Assessment context</h2>
      <dl className="mt-5 grid gap-4">
        <Info label="Lead" value={`${context.lead.firstName} ${context.lead.lastName}`} />
        <Info
          label="Contact"
          value={[context.lead.email, context.lead.phone].filter(Boolean).join(" · ")}
        />
        <Info
          label="Property"
          value={`${context.property.addressLine1}, ${context.property.city}, ${context.property.state} ${context.property.postalCode}`}
        />
        <Info
          label="Requested services"
          value={context.lead.requestedServices
            .map((item) => item.serviceType.replaceAll("_", " "))
            .join(", ")}
        />
        <Info
          label="Consultation"
          value={new Date(context.consultation.scheduledStart).toLocaleString()}
        />
        <Info
          label="Outcome"
          value={context.consultation.outcome?.replaceAll("_", " ") ?? "Not recorded"}
        />
        <Info label="Completion notes" value={context.consultation.completionNotes ?? "None"} />
      </dl>
    </section>
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
