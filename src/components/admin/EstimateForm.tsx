"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateEstimateDocument, EstimateContextDocument } from "@/graphql/generated/graphql";
import { EstimateFields, estimateItemsInput, type EditableLineItem } from "./EstimateFields";

export function EstimateForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(EstimateContextDocument, {
    variables: { leadId },
    fetchPolicy: "network-only",
  });
  const [create, result] = useMutation(CreateEstimateDocument);
  const [items, setItems] = useState<EditableLineItem[]>([
    { description: "", quantity: "1", unitPrice: "" },
  ]);
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <p className="py-12 text-center">Loading estimate context</p>;
  if (error || !data?.estimateContext)
    return <div className="rounded-xl bg-white p-8">This lead is not ready for an estimate.</div>;
  const context = data.estimateContext;
  if (context.estimate)
    return (
      <div className="rounded-xl bg-white p-8">
        <h1 className="text-2xl font-bold">Estimate already exists</h1>
        <Link
          href={`/admin/estimates/${context.estimate.id}`}
          className="mt-4 inline-block font-semibold text-[#476654] hover:underline"
        >
          View Estimate
        </Link>
      </div>
    );
  async function save(formData: FormData) {
    setMessage(null);
    try {
      const response = await create({
        variables: {
          input: {
            leadId,
            details: String(formData.get("details") ?? ""),
            notes: String(formData.get("notes") ?? ""),
            lineItems: estimateItemsInput(items),
          },
        },
      });
      const id = response.data?.createEstimate.id;
      if (!id) throw new Error("Estimate was not returned.");
      router.push(`/admin/estimates/${id}`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Estimate could not be saved.");
    }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold text-[#173f32]">Estimate context</h2>
        <dl className="mt-5 grid gap-4">
          <Info label="Lead" value={`${context.lead.firstName} ${context.lead.lastName}`} />
          <Info
            label="Contact"
            value={[context.lead.email, context.lead.phone].filter(Boolean).join(" · ")}
          />
          <Info
            label="Requested services"
            value={context.lead.requestedServices
              .map((service) => service.serviceType.replaceAll("_", " "))
              .join(", ")}
          />
          <Info
            label="Consultation outcome"
            value={context.consultation?.outcome?.replaceAll("_", " ") ?? "Not recorded"}
          />
          <Info
            label="Assessment"
            value={
              context.assessment ? context.assessment.status.replaceAll("_", " ") : "Not required"
            }
          />
        </dl>
      </section>
      <form action={save} className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-[#173f32]">Estimate</h1>
        <p className="mt-2 text-sm text-[#5b685f]">
          Create a practical service breakdown and save it as a draft.
        </p>
        <EstimateFields onItemsChange={setItems} />
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
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[#66736a] uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
