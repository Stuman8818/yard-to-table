import { describe, expect, it } from "vitest";

import { buildLeadNotification } from "./lead-notification";

describe("buildLeadNotification", () => {
  it("includes the estimate-request category, details, and desired timing", () => {
    const notification = buildLeadNotification({
      firstName: "Jane",
      lastName: "Gardner",
      email: "jane@example.com",
      phone: "555-123-4567",
      address: "123 Garden Lane",
      city: "Indianapolis",
      state: "IN",
      postalCode: "46204",
      serviceTypes: ["LAWN_MAINTENANCE"],
      serviceDetails: ["LAWN_WEEKLY_MOWING"],
      desiredTiming: "NEXT_FEW_WEEKS",
      message: "Please help with my lawn care service.",
    });

    expect(notification.subject).toBe("New estimate request from Jane Gardner");
    expect(notification.text).toContain("Name: Jane Gardner");
    expect(notification.text).toContain("State: IN");
    expect(notification.text).toContain("Service categories: Lawn Maintenance");
    expect(notification.text).toContain("Specific services: Weekly mowing");
    expect(notification.text).toContain("Desired timing: Within the next few weeks");
    expect(notification.html).toContain("Jane Gardner");
  });
});
