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
    serviceTypes: ["LAWN_CARE"],
    message: "Please help with my vegetable garden.",
  },
};

async function completeForm() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("First name"), variables.input.firstName);
  await user.type(screen.getByLabelText("Last name"), variables.input.lastName);
  await user.type(screen.getByLabelText("Phone number"), variables.input.phone);
  await user.type(screen.getByLabelText("Street address"), variables.input.address);
  await user.type(screen.getByLabelText("City"), variables.input.city);
  await user.type(screen.getByLabelText("ZIP code"), variables.input.postalCode);
  await user.type(screen.getByLabelText("Email address"), variables.input.email);
  await user.type(screen.getByLabelText("Notes"), variables.input.message);
  await user.click(screen.getByRole("button", { name: "Join the early interest list" }));
}

describe("ContactForm", () => {
  it("enables lawn care and prevents selecting future services", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MockedProvider>
        <ContactForm />
      </MockedProvider>,
    );

    expect(screen.getByRole("checkbox", { name: /Lawn Care/i })).toBeEnabled();
    expect(screen.getByRole("checkbox", { name: /Lawn Care/i })).toBeChecked();
    expect(
      screen.getByText(/Includes mowing, trimming and edging, and cleanup/i),
    ).toBeInTheDocument();
    for (const legacyValue of ["LAWN_MOWING", "TRIMMING_EDGING", "YARD_CLEANUP"]) {
      expect(container.querySelector(`input[value="${legacyValue}"]`)).not.toBeInTheDocument();
    }
    const gardenDesign = screen.getByRole("checkbox", { name: /Garden Design.*Coming soon/i });
    expect(gardenDesign).toBeDisabled();
    await user.click(gardenDesign);
    expect(gardenDesign).not.toBeChecked();
    expect(screen.getAllByText("Coming soon")).toHaveLength(5);
  });

  it("defaults state to IN and prevents editing it", () => {
    render(
      <MockedProvider>
        <ContactForm />
      </MockedProvider>,
    );

    expect(screen.getByLabelText("State")).toHaveValue("IN");
    expect(screen.getByLabelText("State")).toBeDisabled();
    expect(screen.getByText("Preparing for an initial Indiana launch.")).toBeInTheDocument();
  });

  it("shows success and resets the form after a confirmed submission", async () => {
    render(
      <MockedProvider
        mocks={[
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
        ]}
      >
        <ContactForm />
      </MockedProvider>,
    );

    await completeForm();

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thanks—your interest has been recorded.",
    );
    expect(screen.getByLabelText("First name")).toHaveValue("");
    expect(screen.getByLabelText("Last name")).toHaveValue("");
    expect(screen.getByLabelText("State")).toHaveValue("IN");
    expect(screen.getByRole("checkbox", { name: /Lawn Care/i })).toBeChecked();
  });

  it("shows a safe error and preserves values when submission fails", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: CreateLeadDocument, variables },
            error: new Error("network unavailable"),
          },
        ]}
      >
        <ContactForm />
      </MockedProvider>,
    );

    await completeForm();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We couldn’t record your interest. Please try again.",
    );
    expect(screen.getByLabelText("First name")).toHaveValue("Jane");
    expect(screen.getByLabelText("Last name")).toHaveValue("Gardner");
  });
});
