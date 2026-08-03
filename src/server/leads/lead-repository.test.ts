import { describe, expect, it, vi } from "vitest";

import {
  addLeadNoteForOrganization,
  findLeadForOrganization,
  findLeadsForOrganization,
  updateLeadStatusForOrganization,
} from "./lead-repository";

describe("tenant-scoped lead repository", () => {
  it("keeps search and status filters inside the organization scope", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    await findLeadsForOrganization({ lead: { findMany } } as never, "organization-1", {
      search: "smith",
      status: "NEW",
      sort: "oldest",
    });

    expect(findMany).toHaveBeenCalledWith({
      where: {
        organizationId: "organization-1",
        status: "NEW",
        OR: expect.arrayContaining([
          { firstName: { contains: "smith", mode: "insensitive" } },
          { email: { contains: "smith", mode: "insensitive" } },
        ]),
      },
      include: { requestedServices: true },
      orderBy: { createdAt: "asc" },
    });
  });

  it("looks up details by both lead and organization IDs", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    await findLeadForOrganization({ lead: { findFirst } } as never, "organization-1", "lead-2");
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "lead-2", organizationId: "organization-1" } }),
    );
  });

  it("does not update a lead in another organization", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 });
    const findFirst = vi.fn();
    const result = await updateLeadStatusForOrganization(
      { lead: { updateMany, findFirst } } as never,
      "organization-1",
      "other-lead",
      "CONTACTED",
    );
    expect(result).toBeNull();
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "other-lead", organizationId: "organization-1" },
      data: { status: "CONTACTED" },
    });
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("updates and rereads a lead inside the organization scope", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const findFirst = vi.fn().mockResolvedValue({ id: "lead-1", status: "CONTACTED" });
    await expect(
      updateLeadStatusForOrganization(
        { lead: { updateMany, findFirst } } as never,
        "organization-1",
        "lead-1",
        "CONTACTED",
      ),
    ).resolves.toMatchObject({ id: "lead-1", status: "CONTACTED" });
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "lead-1", organizationId: "organization-1" } }),
    );
  });

  it("uses the authenticated author only after verifying lead ownership", async () => {
    const findFirst = vi.fn().mockResolvedValue({ id: "lead-1" });
    const create = vi.fn().mockResolvedValue({ id: "note-1" });
    await addLeadNoteForOrganization(
      { lead: { findFirst }, leadNote: { create } } as never,
      "organization-1",
      "lead-1",
      "session-user",
      "Called the homeowner.",
    );
    expect(findFirst).toHaveBeenCalledWith({
      where: { id: "lead-1", organizationId: "organization-1" },
      select: { id: true },
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          leadId: "lead-1",
          authorUserId: "session-user",
          content: "Called the homeowner.",
        },
      }),
    );
  });

  it("does not add a note to a lead in another organization", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const create = vi.fn();
    await expect(
      addLeadNoteForOrganization(
        { lead: { findFirst }, leadNote: { create } } as never,
        "organization-1",
        "other-lead",
        "session-user",
        "Private note",
      ),
    ).resolves.toBeNull();
    expect(create).not.toHaveBeenCalled();
  });
});
