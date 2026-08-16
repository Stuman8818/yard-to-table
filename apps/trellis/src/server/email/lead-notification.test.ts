import { describe, expect, it } from "vitest";

import { buildLeadNotification } from "./lead-notification";

describe("buildLeadNotification", () => {
  it("uses the full name and includes the lawn-care service", () => {
    const notification = buildLeadNotification({
      firstName: "Jane",
      lastName: "Gardner",
      email: "jane@example.com",
      phone: "555-123-4567",
      address: "123 Garden Lane",
      city: "Indianapolis",
      state: "IN",
      postalCode: "46204",
      serviceTypes: ["LAWN_CARE"],
      message: "Please help with my lawn care service.",
    });

    expect(notification.subject).toBe("New contact request from Jane Gardner");
    expect(notification.text).toContain("Name: Jane Gardner");
    expect(notification.text).toContain("State: IN");
    expect(notification.text).toContain("Services: Lawn Care");
    expect(notification.html).toContain("Jane Gardner");
  });
});
