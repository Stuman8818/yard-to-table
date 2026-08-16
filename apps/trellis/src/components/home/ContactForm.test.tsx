/**
 * @vitest-environment jsdom
 */

import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CreateLeadDocument } from "@/graphql/generated/graphql";
import ContactForm from "./ContactForm";

const variables = {
  input: {
    firstName: "Jane",
    lastName: "Gardner",
    phone: "555-123-4567",
    address: "123 Garden Lane",
    city: "Indianapolis",
    state: "IN",
    postalCode: "46204",
    email: "jane@example.com",
    serviceTypes: ["LAWN_MAINTENANCE"],
    serviceDetails: ["LAWN_WEEKLY_MOWING"],
    message: "Please help with recurring lawn maintenance.",
  },
};

function renderForm(mocks: React.ComponentProps<typeof MockedProvider>["mocks"] = []) {
  return render(
    <MockedProvider mocks={mocks}>
      <ContactForm />
    </MockedProvider>,
  );
}

async function completeForm() {
  const user = userEvent.setup();

  await user.click(screen.getByRole("checkbox", { name: /Lawn Maintenance/i }));
  await user.click(screen.getByRole("checkbox", { name: "Weekly mowing" }));
  await user.type(screen.getByLabelText("Tell us about your project"), variables.input.message);
  await user.type(screen.getByLabelText("First name"), variables.input.firstName);
  await user.type(screen.getByLabelText("Last name"), variables.input.lastName);
  await user.type(screen.getByLabelText("Phone number"), variables.input.phone);
  await user.type(screen.getByLabelText("Email address"), variables.input.email);
  await user.type(screen.getByLabelText("Street address"), variables.input.address);
  await user.type(screen.getByLabelText("City"), variables.input.city);
  await user.type(screen.getByLabelText("ZIP code"), variables.input.postalCode);
  await user.click(screen.getByRole("button", { name: "Request an Estimate" }));
}

describe("ContactForm", () => {
  it("offers active, multi-select service categories without launch language", async () => {
    const user = userEvent.setup();
    renderForm();

    const lawn = screen.getByRole("checkbox", { name: /Lawn Maintenance/i });
    const landscape = screen.getByRole("checkbox", { name: /Landscape Maintenance/i });

    expect(lawn).toBeEnabled();
    expect(landscape).toBeEnabled();
    expect(lawn).not.toBeChecked();
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();

    await user.click(lawn);
    await user.click(landscape);
    expect(lawn).toBeChecked();
    expect(landscape).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Weekly mowing" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Weeding" })).toBeInTheDocument();
  });

  it("removes stale child services when their category is deselected", async () => {
    const user = userEvent.setup();
    renderForm();

    const lawn = screen.getByRole("checkbox", { name: /Lawn Maintenance/i });
    await user.click(lawn);
    await user.click(screen.getByRole("checkbox", { name: "Weekly mowing" }));
    await user.click(lawn);

    expect(screen.queryByRole("checkbox", { name: "Weekly mowing" })).not.toBeInTheDocument();

    await user.click(lawn);
    expect(screen.getByRole("checkbox", { name: "Weekly mowing" })).not.toBeChecked();
  });

  it("allows a not-sure request without showing child selections", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("checkbox", { name: /Not Sure What I Need/i }));

    expect(
      screen.queryByRole("heading", { name: "Any specific services?" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Tell us about your project")).toBeRequired();
  });

  it("requires at least one top-level service category", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Request an Estimate" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please correct the highlighted fields.",
    );
    expect(screen.getByText("Select at least one type of work.")).toBeInTheDocument();
  });

  it("defaults state to IN and explains the active service area", () => {
    renderForm();

    expect(screen.getByLabelText("State")).toHaveValue("IN");
    expect(screen.getByLabelText("State")).toBeDisabled();
    expect(screen.getByText(/currently serves properties in Indiana/i)).toBeInTheDocument();
  });

  it("submits category, detail, and project information, then resets", async () => {
    renderForm([
      {
        request: { query: CreateLeadDocument, variables },
        result: {
          data: {
            createLead: {
              __typename: "CreateLeadPayload",
              success: true,
              leadId: "lead-1",
              message: "Your request has been received.",
            },
          },
        },
      },
    ]);

    await completeForm();

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thanks—your estimate request has been received.",
    );
    expect(screen.getByLabelText("First name")).toHaveValue("");
    expect(screen.getByRole("checkbox", { name: /Lawn Maintenance/i })).not.toBeChecked();
    expect(screen.queryByLabelText(/When would you like the work done/i)).not.toBeInTheDocument();
  });

  it("shows a safe error and preserves values when submission fails", async () => {
    renderForm([
      {
        request: { query: CreateLeadDocument, variables },
        error: new Error("network unavailable"),
      },
    ]);

    await completeForm();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn’t submit your request. Please try again.",
    );
    expect(screen.getByLabelText("First name")).toHaveValue("Jane");
    expect(screen.getByRole("checkbox", { name: /Lawn Maintenance/i })).toBeChecked();
  });
});
