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

    await expect(
      createLead(validInput, {
        leadRepository,
        organizationId: "organization-1",
        sendNotification,
      }),
    ).resolves.toEqual({ leadId: "lead-1" });
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
        organization: {
          connect: { id: "organization-1" },
        },
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

  it.each([{ state: "OH" }, { serviceTypes: ["UNKNOWN_SERVICE"] }])(
    "rejects unavailable submission values: $state$serviceTypes",
    async (override) => {
      const leadRepository = createRepositoryMock();

      await expect(
        createLead(
          { ...validInput, ...override },
          { leadRepository, organizationId: "organization-1" },
        ),
      ).rejects.toThrow("Lead submission validation failed.");
      expect(leadRepository.create).not.toHaveBeenCalled();
    },
  );

  it("does not send an email when the database write fails", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockRejectedValue(new Error("database unavailable"));
    const sendNotification = vi.fn();

    await expect(
      createLead(validInput, {
        leadRepository,
        organizationId: "organization-1",
        sendNotification,
      }),
    ).rejects.toThrow("database unavailable");
    expect(sendNotification).not.toHaveBeenCalled();
  });

  it("stores new categories as requested services and formats optional request context", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockResolvedValue({ id: "lead-new-request" });

    await createLead(
      {
        ...validInput,
        serviceTypes: ["LANDSCAPE_MAINTENANCE", "PROPERTY_CLEANUP_REFRESH"],
        serviceDetails: ["MAINTENANCE_WEEDING", "REFRESH_BED_RENOVATION"],
        desiredTiming: "ONE_TO_THREE_MONTHS",
      },
      {
        leadRepository,
        organizationId: "organization-1",
        sendNotification: vi.fn().mockResolvedValue(undefined),
      },
    );

    expect(leadRepository.create.mock.calls[0]?.[0].data).toMatchObject({
      notes:
        "Project description:\nPlease help with my garden beds.\n\nSpecific services:\nWeeding, Existing bed renovation\n\nDesired timing:\nWithin 1–3 months",
      requestedServices: {
        create: [
          { serviceType: "LANDSCAPE_MAINTENANCE" },
          { serviceType: "PROPERTY_CLEANUP_REFRESH" },
        ],
      },
    });
  });

  it("keeps the saved lead successful when Resend fails", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockResolvedValue({ id: "lead-2" });
    const sendNotification = vi.fn().mockRejectedValue(new Error("email unavailable"));
    const logger = { error: vi.fn() };

    await expect(
      createLead(validInput, {
        leadRepository,
        organizationId: "organization-1",
        sendNotification,
        logger,
      }),
    ).resolves.toEqual({ leadId: "lead-2" });
    expect(logger.error).toHaveBeenCalledWith("Lead notification email failed.", {
      leadId: "lead-2",
      errorType: "Error",
    });
  });

  it("ignores a client-provided organization ID and uses the server-resolved organization", async () => {
    const leadRepository = createRepositoryMock();
    leadRepository.create.mockResolvedValue({ id: "lead-3" });

    await createLead(
      { ...validInput, organizationId: "attacker-organization" },
      {
        leadRepository,
        organizationId: "organization-1",
        sendNotification: vi.fn().mockResolvedValue(undefined),
      },
    );

    expect(leadRepository.create.mock.calls[0]?.[0].data).toMatchObject({
      organization: { connect: { id: "organization-1" } },
    });
    expect(JSON.stringify(leadRepository.create.mock.calls[0]?.[0].data)).not.toContain(
      "attacker-organization",
    );
  });
});
