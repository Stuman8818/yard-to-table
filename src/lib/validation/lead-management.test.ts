import { describe, expect, it } from "vitest";

import {
  addLeadNoteSchema,
  leadListFiltersSchema,
  updateLeadStatusSchema,
} from "./lead-management";

describe("lead management validation", () => {
  it("normalizes list filters and rejects invalid sort values safely", () => {
    expect(leadListFiltersSchema.parse({ search: "  Smith  ", sort: "invalid" })).toEqual({
      search: "Smith",
      sort: "newest",
    });
  });

  it("accepts only existing lead statuses", () => {
    expect(
      updateLeadStatusSchema.safeParse({ leadId: "lead-1", status: "CONTACTED" }).success,
    ).toBe(true);
    expect(updateLeadStatusSchema.safeParse({ leadId: "lead-1", status: "HACKED" }).success).toBe(
      false,
    );
  });

  it("trims internal notes and enforces their length", () => {
    expect(
      addLeadNoteSchema.parse({ leadId: "lead-1", content: "  Follow up Tuesday.  " }).content,
    ).toBe("Follow up Tuesday.");
    expect(addLeadNoteSchema.safeParse({ leadId: "lead-1", content: "" }).success).toBe(false);
    expect(
      addLeadNoteSchema.safeParse({ leadId: "lead-1", content: "x".repeat(2001) }).success,
    ).toBe(false);
  });
});
