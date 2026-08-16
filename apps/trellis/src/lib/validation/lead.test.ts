import { describe, expect, it } from "vitest";

import { leadSubmissionSchema } from "./lead";

const validInput = {
  firstName: "  Jane  ",
  lastName: "  Gardner  ",
  email: "  jane@example.com  ",
  phone: "(555) 123-4567",
  address: "  123 Garden Lane  ",
  city: "  Indianapolis  ",
  state: "IN",
  postalCode: "46204",
  serviceTypes: ["LANDSCAPE_MAINTENANCE"],
  serviceDetails: ["MAINTENANCE_WEEDING"],
  desiredTiming: "NEXT_FEW_WEEKS",
  message: "  I would like help restoring my landscape beds.  ",
};

describe("leadSubmissionSchema", () => {
  it("accepts and trims a complete estimate request", () => {
    expect(leadSubmissionSchema.parse(validInput)).toEqual({
      firstName: "Jane",
      lastName: "Gardner",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      address: "123 Garden Lane",
      city: "Indianapolis",
      state: "IN",
      postalCode: "46204",
      serviceTypes: ["LANDSCAPE_MAINTENANCE"],
      serviceDetails: ["MAINTENANCE_WEEDING"],
      desiredTiming: "NEXT_FEW_WEEKS",
      message: "I would like help restoring my landscape beds.",
    });
  });

  it("allows multiple categories without requiring child services or timing", () => {
    const result = leadSubmissionSchema.safeParse({
      ...validInput,
      serviceTypes: ["LAWN_MAINTENANCE", "NOT_SURE"],
      serviceDetails: undefined,
      desiredTiming: undefined,
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.serviceDetails).toEqual([]);
  });

  it("keeps legacy category submissions backward compatible", () => {
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput,
        serviceTypes: ["LAWN_CARE"],
        serviceDetails: [],
      }).success,
    ).toBe(true);
  });

  it("requires a category and rejects duplicate categories", () => {
    expect(leadSubmissionSchema.safeParse({ ...validInput, serviceTypes: [] }).success).toBe(false);
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput,
        serviceTypes: ["LAWN_MAINTENANCE", "LAWN_MAINTENANCE"],
        serviceDetails: [],
      }).success,
    ).toBe(false);
  });

  it("rejects a child service whose parent category is not selected", () => {
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput,
        serviceTypes: ["GARDEN_INSTALLATION"],
        serviceDetails: ["MAINTENANCE_WEEDING"],
      }).success,
    ).toBe(false);
  });

  it("rejects invalid contact, location, timing, and description values", () => {
    for (const override of [
      { email: "not-an-email" },
      { phone: "555-CALL-NOW" },
      { state: "OH" },
      { postalCode: "1234" },
      { desiredTiming: "SOMEDAY" },
      { message: "" },
    ]) {
      expect(leadSubmissionSchema.safeParse({ ...validInput, ...override }).success).toBe(false);
    }
  });
});
