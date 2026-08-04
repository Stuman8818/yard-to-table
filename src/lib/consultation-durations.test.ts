import { describe, expect, it } from "vitest";
import { consultationEndFromDuration } from "./consultation-durations";

describe("consultation duration", () => {
  it("adds the selected duration to the start time", () => {
    expect(consultationEndFromDuration("2026-08-03T10:00:00.000Z", "90")).toBe(
      "2026-08-03T11:30:00.000Z",
    );
  });

  it("rejects durations outside the configured intervals", () => {
    expect(consultationEndFromDuration("2026-08-03T10:00:00.000Z", "45")).toBeNull();
  });
});
