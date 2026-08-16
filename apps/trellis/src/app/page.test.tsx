/**
 * @vitest-environment jsdom
 */

import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import IntakePage from "./page";

describe("Trellis customer intake", () => {
  it("owns the customer service request form", () => {
    render(
      <MockedProvider>
        <IntakePage />
      </MockedProvider>,
    );

    expect(screen.getByRole("region", { name: "Customer service request" })).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Street address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /request an estimate/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Powered by Trellis")).toBeInTheDocument();
    expect(screen.queryByText(/enters the Trellis service workflow/i)).not.toBeInTheDocument();
  });

  it("sets clear expectations around operational follow-up", () => {
    render(
      <MockedProvider>
        <IntakePage />
      </MockedProvider>,
    );

    expect(screen.getByText(/review your request and follow up/i)).toBeInTheDocument();
  });
});
