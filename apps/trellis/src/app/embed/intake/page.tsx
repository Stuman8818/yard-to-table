import type { Metadata } from "next";

import { IntakeExperience } from "@/components/intake/IntakeExperience";
import { EmbedHeightReporter } from "@/components/intake/EmbedHeightReporter";

export const metadata: Metadata = {
  title: "Request landscaping service",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbeddedIntakePage() {
  return (
    <>
      <EmbedHeightReporter />
      <IntakeExperience embedded />
    </>
  );
}
