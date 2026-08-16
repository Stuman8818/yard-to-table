export const serviceDefinitions = {
  LAWN_CARE: {
    label: "Lawn Care",
    description: "Legacy lawn-care requests submitted before the current service categories.",
  },
  GARDEN_CONSULTATION: {
    label: "Garden Consultation",
    description: "Legacy garden consultation requests.",
  },
  GARDEN_DESIGN: {
    label: "Garden Design",
    description: "Legacy garden design requests.",
  },
  GARDEN_INSTALLATION: {
    label: "Garden Installation",
    description: "Vegetable gardens, raised beds, garden planning, soil preparation, and planting.",
  },
  RAISED_BED_INSTALLATION: {
    label: "Raised Bed Installation",
    description: "Legacy raised-bed installation requests.",
  },
  GARDEN_MAINTENANCE: {
    label: "Garden Maintenance",
    description: "Legacy garden maintenance requests.",
  },
  LAWN_MAINTENANCE: {
    label: "Lawn Maintenance",
    description: "Recurring mowing, string trimming, edging, blowing, and hedge trimming.",
  },
  LANDSCAPE_MAINTENANCE: {
    label: "Landscape Maintenance",
    description:
      "Mulch, bed care, weeding, shrub trimming, seasonal cleanup, and plant replacement.",
  },
  LANDSCAPE_INSTALLATION: {
    label: "Landscape Installation",
    description: "New or expanded landscape beds, plants, mulch, and rock installation.",
  },
  PROPERTY_CLEANUP_REFRESH: {
    label: "Property Cleanup & Refresh",
    description: "Renovation and cleanup work that restores overgrown or outdated landscapes.",
  },
  NOT_SURE: {
    label: "Not Sure What I Need",
    description: "Describe the property or project and let us recommend the right service.",
  },
} as const;

export type ServiceType = keyof typeof serviceDefinitions;

export const customerServiceCategories = [
  {
    id: "LAWN_MAINTENANCE",
    ...serviceDefinitions.LAWN_MAINTENANCE,
    services: [
      { id: "LAWN_WEEKLY_MOWING", label: "Weekly mowing" },
      { id: "LAWN_STRING_TRIMMING", label: "String trimming" },
      { id: "LAWN_EDGING", label: "Edging" },
      { id: "LAWN_BLOWING", label: "Blowing" },
      { id: "LAWN_HEDGE_TRIMMING", label: "Hedge trimming" },
      { id: "LAWN_OTHER", label: "Other" },
    ],
  },
  {
    id: "LANDSCAPE_MAINTENANCE",
    ...serviceDefinitions.LANDSCAPE_MAINTENANCE,
    services: [
      { id: "MAINTENANCE_MULCH_INSTALLATION", label: "Mulch installation" },
      { id: "MAINTENANCE_BED_EDGING", label: "Bed edging" },
      { id: "MAINTENANCE_WEEDING", label: "Weeding" },
      { id: "MAINTENANCE_SHRUB_TRIMMING", label: "Shrub trimming" },
      { id: "MAINTENANCE_SPRING_CLEANUP", label: "Spring cleanup" },
      { id: "MAINTENANCE_FALL_CLEANUP", label: "Fall cleanup" },
      { id: "MAINTENANCE_PLANT_REPLACEMENT", label: "Plant replacement" },
      { id: "MAINTENANCE_OTHER", label: "Other" },
    ],
  },
  {
    id: "LANDSCAPE_INSTALLATION",
    ...serviceDefinitions.LANDSCAPE_INSTALLATION,
    services: [
      { id: "LANDSCAPE_NEW_BEDS", label: "New landscape beds" },
      { id: "LANDSCAPE_BED_EXPANSION", label: "Bed expansion" },
      { id: "LANDSCAPE_FLOWERS_PERENNIALS", label: "Flowers and perennials" },
      { id: "LANDSCAPE_SHRUBS", label: "Shrubs" },
      { id: "LANDSCAPE_ORNAMENTAL_PLANTS", label: "Small ornamental plants" },
      { id: "LANDSCAPE_ROCK_INSTALLATION", label: "Rock installation" },
      { id: "LANDSCAPE_MULCH_INSTALLATION", label: "Mulch installation" },
      { id: "LANDSCAPE_OTHER", label: "Other" },
    ],
  },
  {
    id: "GARDEN_INSTALLATION",
    ...serviceDefinitions.GARDEN_INSTALLATION,
    services: [
      { id: "GARDEN_VEGETABLE_INSTALLATION", label: "Vegetable garden installation" },
      { id: "GARDEN_RAISED_BEDS", label: "Raised garden beds" },
      { id: "GARDEN_LAYOUT_DESIGN", label: "Garden layout and design" },
      { id: "GARDEN_SOIL_PREPARATION", label: "Soil preparation" },
      { id: "GARDEN_PLANTING", label: "Planting" },
      { id: "GARDEN_SEASONAL_SETUP", label: "Seasonal garden setup" },
      { id: "GARDEN_OTHER", label: "Other" },
    ],
  },
  {
    id: "PROPERTY_CLEANUP_REFRESH",
    ...serviceDefinitions.PROPERTY_CLEANUP_REFRESH,
    services: [
      { id: "REFRESH_BED_RENOVATION", label: "Existing bed renovation" },
      { id: "REFRESH_OVERGROWN_CLEANUP", label: "Overgrown landscape cleanup" },
      { id: "REFRESH_DEAD_PLANT_REPLACEMENT", label: "Dead plant replacement" },
      { id: "REFRESH_MULCH", label: "Mulch refresh" },
      { id: "REFRESH_ROCK", label: "Rock refresh" },
      { id: "REFRESH_BED_RESHAPING", label: "Bed reshaping" },
      { id: "REFRESH_CURB_APPEAL", label: "General curb-appeal improvements" },
      { id: "REFRESH_OTHER", label: "Other" },
    ],
  },
  {
    id: "NOT_SURE",
    ...serviceDefinitions.NOT_SURE,
    services: [],
  },
] as const;

export type CustomerServiceType = (typeof customerServiceCategories)[number]["id"];
type ArrayItem<T> = T extends readonly (infer Item)[] ? Item : never;
type ServiceDetailDefinition = ArrayItem<(typeof customerServiceCategories)[number]["services"]>;
export type ServiceDetailType = ServiceDetailDefinition["id"];

export const desiredTimingOptions = [
  { value: "AS_SOON_AS_POSSIBLE", label: "As soon as possible" },
  { value: "NEXT_FEW_WEEKS", label: "Within the next few weeks" },
  { value: "ONE_TO_THREE_MONTHS", label: "Within 1–3 months" },
  { value: "PLANNING_ESTIMATE", label: "Just planning / getting an estimate" },
  { value: "FLEXIBLE", label: "Flexible" },
] as const;

export type DesiredTiming = (typeof desiredTimingOptions)[number]["value"];

export const customerServiceTypes = customerServiceCategories.map(({ id }) => id);
export const serviceDetailTypes = customerServiceCategories.reduce<ServiceDetailType[]>(
  (details, category) => [
    ...details,
    ...category.services.map(({ id }) => id as ServiceDetailType),
  ],
  [],
);

export function getServiceDetailLabel(serviceDetail: string): string | undefined {
  for (const category of customerServiceCategories) {
    const service = category.services.find(({ id }) => (id as string) === serviceDetail) as
      ServiceDetailDefinition | undefined;

    if (service) {
      return service.label;
    }
  }

  return undefined;
}

export function getServiceDetailCategory(serviceDetail: string): CustomerServiceType | undefined {
  return customerServiceCategories.find(({ services }) =>
    services.some(({ id }) => id === serviceDetail),
  )?.id;
}

export function getDesiredTimingLabel(timing: string | undefined): string | undefined {
  return desiredTimingOptions.find(({ value }) => value === timing)?.label;
}
