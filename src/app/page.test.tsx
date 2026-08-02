/**
 * @vitest-environment jsdom
 */

import { MockedProvider } from "@apollo/client/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

function renderHome() {
  return render(
    <MockedProvider>
      <Home />
    </MockedProvider>,
  );
}

describe("homepage positioning", () => {
  it("presents a pre-launch lawn and garden company without claiming availability", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A better way to care for your yard and grow what comes next.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Services are not yet available/i)).toBeInTheDocument();
    expect(
      screen.getByText(/not currently available for purchase or scheduling/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/currently servicing/i)).not.toBeInTheDocument();
  });

  it("explains the company operating platform and engineering case study", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { name: "A service company powered by its own software." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A production-minded full-stack application." }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "Concept preview of the internal Yard To Table property-planning system",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Yard To Table brand mark")).toBeInTheDocument();
    expect(screen.getByText("Powered by the Yard To Table operating platform")).toBeInTheDocument();
    expect(screen.getByAltText("Yard To Table original illustrated logo")).toBeInTheDocument();
  });

  it("uses valid navigation targets and business-first footer copy", () => {
    const { container } = renderHome();

    for (const target of ["how-it-works", "services", "platform", "roadmap", "interest"]) {
      expect(container.querySelector(`#${target}`)).toBeInTheDocument();
      expect(
        container.querySelector(`a[href="/#${target}"], a[href="#${target}"]`),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(/pre-launch lawn-care and garden-services company/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/full-stack software engineering case study/i)).toBeInTheDocument();
    expect(screen.queryByText("© 2026 Yard To Table. Product concept.")).not.toBeInTheDocument();
  });
});
