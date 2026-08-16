"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import {
  CompleteEstimateDocument,
  EstimateDetailsDocument,
  UpdateEstimateDocument,
} from "@/graphql/generated/graphql";
import { EstimateFields, estimateItemsInput, type EditableLineItem } from "./EstimateFields";

export function EstimateDetails({ estimateId, canEdit }: { estimateId: string; canEdit: boolean }) {
  const { data, loading, error, refetch } = useQuery(EstimateDetailsDocument, {
    variables: { id: estimateId },
    fetchPolicy: "network-only",
  });
  const [update, updateResult] = useMutation(UpdateEstimateDocument);
  const [complete, completeResult] = useMutation(CompleteEstimateDocument);
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<EditableLineItem[] | null>(null);
  if (loading) return <p className="py-12 text-center">Loading estimate</p>;
  if (error || !data?.estimate)
    return <div className="rounded-xl bg-white p-8">Estimate not found or unavailable.</div>;
  const estimate = data.estimate;
  const completed = estimate.status === "COMPLETED";
  const initialItems = estimate.lineItems.map((item) => ({
    description: item.description,
    quantity: String(item.quantity),
    unitPrice: (item.unitPriceCents / 100).toFixed(2),
  }));
  async function save(formData: FormData) {
    setMessage(null);
    try {
      await update({
        variables: {
          input: {
            estimateId,
            details: String(formData.get("details") ?? ""),
            notes: String(formData.get("notes") ?? ""),
            lineItems: estimateItemsInput(items ?? initialItems),
          },
        },
      });
      await refetch();
      setMessage("Estimate saved as draft.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Estimate could not be saved.");
    }
  }
  async function finalize() {
    setMessage(null);
    try {
      await complete({ variables: { estimateId } });
      await refetch();
      setMessage("Estimate completed.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Estimate could not be completed.");
    }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <section
        className={`rounded-xl border p-6 ${completed ? "border-emerald-300 bg-emerald-50" : "bg-white"}`}
      >
        <h1 className={`text-2xl font-bold ${completed ? "text-emerald-950" : "text-[#173f32]"}`}>
          Estimate
        </h1>
        <p className="mt-2 font-semibold">Status: {estimate.status}</p>
        <p className="mt-4 text-3xl font-bold">
          {(estimate.totalCents / 100).toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <dl className="mt-6 grid gap-4">
          <Info label="Lead" value={`${estimate.lead.firstName} ${estimate.lead.lastName}`} />
          <Info label="Created" value={new Date(estimate.createdAt).toLocaleString()} />
          <Info
            label="Completed"
            value={
              estimate.completedAt
                ? new Date(estimate.completedAt).toLocaleString()
                : "Not completed"
            }
          />
        </dl>
        <Link
          href={`/admin/leads/${estimate.lead.id}`}
          className="mt-6 inline-block font-semibold text-[#476654] hover:underline"
        >
          View Lead
        </Link>
      </section>
      {canEdit && !completed ? (
        <form action={save} className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Edit estimate</h2>
          <EstimateFields
            initialItems={initialItems.length ? initialItems : undefined}
            details={estimate.details ?? ""}
            notes={estimate.notes ?? ""}
            onItemsChange={setItems}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              disabled={updateResult.loading}
              className="rounded-lg bg-[#476654] px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {updateResult.loading ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              disabled={completeResult.loading}
              onClick={finalize}
              className="rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {completeResult.loading ? "Completing..." : "Complete Estimate"}
            </button>
          </div>
          {message ? (
            <p role="status" className="mt-3 text-sm">
              {message}
            </p>
          ) : null}
        </form>
      ) : (
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Estimate details</h2>
          {estimate.details ? <p className="mt-3 whitespace-pre-wrap">{estimate.details}</p> : null}
          <div className="mt-5 divide-y">
            {estimate.lineItems.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-3">
                <span>
                  {item.description} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {(item.totalCents / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
            ))}
          </div>
          {estimate.notes ? (
            <div className="mt-5">
              <h3 className="font-semibold">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap">{estimate.notes}</p>
            </div>
          ) : null}
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
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
