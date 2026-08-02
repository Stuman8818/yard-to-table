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
  serviceTypes: ["LAWN_CARE"],
  message: "  I would like help planning a vegetable garden.  ",
};

describe("leadSubmissionSchema", () => {
  it("accepts and trims valid lead input", () => {
    expect(leadSubmissionSchema.parse(validInput)).toEqual({
      firstName: "Jane",
      lastName: "Gardner",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      address: "123 Garden Lane",
      city: "Indianapolis",
      state: "IN",
      postalCode: "46204",
      serviceTypes: ["LAWN_CARE"],
      message: "I would like help planning a vegetable garden.",
    });
  });

  it("accepts LAWN_CARE and rejects disabled or removed services", () => {
    expect(leadSubmissionSchema.safeParse(validInput).success).toBe(true);

    for (const unavailableValue of [
      "GARDEN_DESIGN",
      "LAWN_MOWING",
      "TRIMMING_EDGING",
      "YARD_CLEANUP",
    ]) {
      expect(
        leadSubmissionSchema.safeParse({ ...validInput, serviceTypes: [unavailableValue] }).success,
      ).toBe(false);
    }
  });

  it("rejects duplicate service values", () => {
    expect(
      leadSubmissionSchema.safeParse({
        ...validInput,
        serviceTypes: ["LAWN_CARE", "LAWN_CARE"],
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(leadSubmissionSchema.safeParse({ ...validInput, email: "not-an-email" }).success).toBe(
      false,
    );
  });

  it.each(["firstName", "lastName"])("rejects a missing %s", (field) => {
    expect(leadSubmissionSchema.safeParse({ ...validInput, [field]: "" }).success).toBe(false);
  });

  it.each(["", "555-12", "+44 20 7946 0958", "555-CALL-NOW"])(
    "rejects an invalid phone value: %s",
    (phone) => {
      expect(leadSubmissionSchema.safeParse({ ...validInput, phone }).success).toBe(false);
    },
  );

  it("rejects an empty message", () => {
    expect(leadSubmissionSchema.safeParse({ ...validInput, message: "   " }).success).toBe(false);
  });

  it.each([
    ["address", ""],
    ["city", ""],
    ["state", "OH"],
    ["postalCode", "1234"],
  ])("rejects an invalid required location field: %s", (field, value) => {
    expect(leadSubmissionSchema.safeParse({ ...validInput, [field]: value }).success).toBe(false);
  });
});
