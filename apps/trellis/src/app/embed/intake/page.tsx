import type { Metadata } from "next";

import { IntakeExperience } from "@/components/intake/IntakeExperience";

export const metadata: Metadata = {
  title: "Request landscaping service",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbeddedIntakePage() {
  return <IntakeExperience embedded />;
}
