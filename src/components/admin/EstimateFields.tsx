"use client";

import { useState } from "react";

export type EditableLineItem = { description: string; quantity: string; unitPrice: string };

export function EstimateFields({
  initialItems = [{ description: "", quantity: "1", unitPrice: "" }],
  details = "",
  notes = "",
  onItemsChange,
}: {
  initialItems?: EditableLineItem[];
  details?: string;
  notes?: string;
  onItemsChange: (items: EditableLineItem[]) => void;
}) {
  const [items, setItems] = useState(initialItems);
  const change = (next: EditableLineItem[]) => {
    setItems(next);
    onItemsChange(next);
  };
  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );
  return (
    <div className="mt-5 grid gap-5">
      <label className="font-semibold">
        Estimate details
        <textarea
          name="details"
          rows={4}
          maxLength={5000}
          defaultValue={details}
          className="mt-2 w-full rounded-lg border p-2"
        />
      </label>
      <div>
        <h3 className="font-semibold">Service breakdown</h3>
        <div className="mt-2 grid gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border bg-[#f7f8f4] p-3 sm:grid-cols-[1fr_7rem_9rem_auto]"
            >
              <label className="text-sm font-semibold">
                Description
                <input
                  value={item.description}
                  onChange={(event) =>
                    change(
                      items.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, description: event.target.value } : entry,
                      ),
                    )
                  }
                  className="mt-1 w-full rounded border bg-white p-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Quantity
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) =>
                    change(
                      items.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, quantity: event.target.value } : entry,
                      ),
                    )
                  }
                  className="mt-1 w-full rounded border bg-white p-2"
                />
              </label>
              <label className="text-sm font-semibold">
                Unit price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) =>
                    change(
                      items.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, unitPrice: event.target.value } : entry,
                      ),
                    )
                  }
                  className="mt-1 w-full rounded border bg-white p-2"
                />
              </label>
              <button
                type="button"
                aria-label={`Remove line item ${index + 1}`}
                onClick={() => change(items.filter((_, itemIndex) => itemIndex !== index))}
                className="self-end rounded border px-3 py-2 text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => change([...items, { description: "", quantity: "1", unitPrice: "" }])}
          className="mt-3 rounded-lg border border-[#476654] px-4 py-2 font-semibold text-[#476654]"
        >
          Add Line Item
        </button>
        <p className="mt-4 text-right text-xl font-bold text-[#173f32]">
          Total: {total.toLocaleString(undefined, { style: "currency", currency: "USD" })}
        </p>
      </div>
      <label className="font-semibold">
        Internal notes
        <textarea
          name="notes"
          rows={3}
          maxLength={5000}
          defaultValue={notes}
          className="mt-2 w-full rounded-lg border p-2"
        />
      </label>
    </div>
  );
}

export const estimateItemsInput = (items: EditableLineItem[]) =>
  items
    .filter((item) => item.description.trim())
    .map((item) => ({
      description: item.description.trim(),
      quantity: Number(item.quantity),
      unitPriceCents: Math.round(Number(item.unitPrice) * 100),
    }));
