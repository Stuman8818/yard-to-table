import type { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { createLead } from "./lead-service";

const validInput = {
  firstName: "Jane",
  lastName: "Gardner",
  email: "CHER@example.com",
  phone: "555-123-4567",
  address: "123 Garden Lane",
  city: "Indianapolis",
  state: "IN",
  postalCode: "46204",
  serviceTypes: ["LAWN_CARE" as const],
  message: "Please help with my garden beds.",
};

function createRepositoryMock() {
  return {
    create:
      vi.fn<
        (args: { data: Prisma.LeadCreateInput; select: { id: true } }) => Promise<{ id: string }>
      >(),
  };
}

describe("lead service", () => {
  it("creates a minimal Prisma record and sends the notification afterward", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockResolvedValue({ id: "lead-1" });
    const sendNotification = vi.fn().mockResolvedValue(undefined);

    await expect(createLead(validInput, { leadRepository, sendNotification })).resolves.toEqual({
      leadId: "lead-1",
    });
    expect(leadRepository.create).toHaveBeenCalledWith({
      data: {
        firstName: "Jane",
        lastName: "Gardner",
        email: "cher@example.com",
        phone: "555-123-4567",
        addressLine1: "123 Garden Lane",
        city: "Indianapolis",
        state: "IN",
        postalCode: "46204",
        notes: "Please help with my garden beds.",
        requestedServices: {
          create: [{ serviceType: "LAWN_CARE" }],
        },
      },
      select: { id: true },
    });
    expect(sendNotification).toHaveBeenCalledOnce();
    expect(leadRepository.create.mock.invocationCallOrder[0]).toBeLessThan(
      sendNotification.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it.each([{ state: "OH" }, { serviceTypes: ["GARDEN_DESIGN"] }])(
    "rejects unavailable submission values: $state$serviceTypes",
    async (override) => {
      const leadRepository = createRepositoryMock();

      await expect(createLead({ ...validInput, ...override }, { leadRepository })).rejects.toThrow(
        "Lead submission validation failed.",
      );
      expect(leadRepository.create).not.toHaveBeenCalled();
    },
  );

  it("does not send an email when the database write fails", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockRejectedValue(new Error("database unavailable"));
    const sendNotification = vi.fn();

    await expect(createLead(validInput, { leadRepository, sendNotification })).rejects.toThrow(
      "database unavailable",
    );
    expect(sendNotification).not.toHaveBeenCalled();
  });

  it("keeps the saved lead successful when Resend fails", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockResolvedValue({ id: "lead-2" });
    const sendNotification = vi.fn().mockRejectedValue(new Error("email unavailable"));
    const logger = { error: vi.fn() };

    await expect(
      createLead(validInput, { leadRepository, sendNotification, logger }),
    ).resolves.toEqual({ leadId: "lead-2" });
    expect(logger.error).toHaveBeenCalledWith("Lead notification email failed.", {
      leadId: "lead-2",
      errorType: "Error",
    });
  });
});
