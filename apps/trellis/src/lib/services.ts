export const serviceDefinitions = {
  LAWN_CARE: {
    label: "Lawn Care",
    description:
      "Includes mowing, trimming and edging, and cleanup of grass clippings from paved areas.",
    includedTasks: ["Lawn mowing", "Trimming and edging", "Cleanup after mowing"],
    enabled: true,
  },
  GARDEN_CONSULTATION: {
    label: "Garden Consultation",
    description: "Get practical guidance for planning and improving your garden.",
    enabled: false,
  },
  GARDEN_DESIGN: {
    label: "Garden Design",
    description: "Plan a garden layout suited to your yard, goals, and growing space.",
    enabled: false,
  },
  GARDEN_INSTALLATION: {
    label: "Garden Installation",
    description: "Turn an approved garden plan into a planted outdoor space.",
    enabled: false,
  },
  RAISED_BED_INSTALLATION: {
    label: "Raised Bed Installation",
    description: "Add raised beds designed for accessible, productive growing.",
    enabled: false,
  },
  GARDEN_MAINTENANCE: {
    label: "Garden Maintenance",
    description: "Request ongoing help caring for an existing garden.",
    enabled: false,
  },
} as const;

export type ServiceType = keyof typeof serviceDefinitions;
