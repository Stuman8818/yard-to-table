/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type CompleteConsultationInput = {
  actualDuration?: number | null | undefined;
  completionNotes?: string | null | undefined;
  consultationId: string | number;
  outcome: ConsultationOutcome;
};

export type ConsultationOutcome =
  | "ASSESSMENT_NEEDED"
  | "CUSTOMER_NOT_INTERESTED"
  | "FOLLOW_UP_NEEDED"
  | "NOT_A_GOOD_FIT"
  | "READY_FOR_ESTIMATE";

export type ConsultationScope = "ALL" | "PAST" | "UPCOMING";

export type ConsultationStatus = "CANCELED" | "COMPLETED" | "NO_SHOW" | "SCHEDULED";

export type ConsultationType = "ON_SITE" | "PHONE";

export type CreateEstimateInput = {
  details?: string | null | undefined;
  leadId: string | number;
  lineItems: Array<EstimateLineItemInput>;
  notes?: string | null | undefined;
};

export type CreateLeadInput = {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  phone: string;
  postalCode: string;
  serviceTypes: Array<ServiceType>;
  state: string;
};

export type CreatePropertyAssessmentInput = {
  accessDifficulty?: string | null | undefined;
  consultationId: string | number;
  disposalNeeded?: string | null | undefined;
  equipmentNeeded?: string | null | undefined;
  estimatedLaborHours?: number | null | undefined;
  generalNotes?: string | null | undefined;
  materialsNeeded?: string | null | undefined;
  recommendedCrewSize?: number | null | undefined;
  requestedWork?: string | null | undefined;
};

export type EstimateLineItemInput = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type EstimateStatus = "COMPLETED" | "DRAFT";

export type LeadSort = "NEWEST" | "OLDEST";

export type LeadStatus =
  | "ASSESSMENT_COMPLETED"
  | "CONSULTATION_COMPLETED"
  | "CONSULTATION_SCHEDULED"
  | "CONTACTED"
  | "CONVERTED"
  | "ESTIMATE_COMPLETED"
  | "ESTIMATE_SENT"
  | "LOST"
  | "NEW";

export type MarkConsultationLeadLostInput = {
  consultationId: string | number;
  reason: string;
};

export type PropertyAssessmentStatus = "CANCELLED" | "COMPLETED" | "DRAFT" | "IN_PROGRESS";

export type ScheduleConsultationInput = {
  customerId: string | number;
  notes?: string | null | undefined;
  propertyId: string | number;
  scheduledEnd: string;
  scheduledStart: string;
};

export type ScheduleLeadConsultationInput = {
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  city?: string | null | undefined;
  leadId: string | number;
  notes?: string | null | undefined;
  postalCode?: string | null | undefined;
  scheduledEnd: string;
  scheduledStart: string;
  state?: string | null | undefined;
  type: ConsultationType;
};

export type ServiceType =
  | "GARDEN_CONSULTATION"
  | "GARDEN_DESIGN"
  | "GARDEN_INSTALLATION"
  | "GARDEN_MAINTENANCE"
  | "LAWN_CARE"
  | "RAISED_BED_INSTALLATION";

export type UpdateConsultationInput = {
  consultationId: string | number;
  notes?: string | null | undefined;
  scheduledEnd: string;
  scheduledStart: string;
  status: ConsultationStatus;
};

export type UpdateEstimateInput = {
  details?: string | null | undefined;
  estimateId: string | number;
  lineItems: Array<EstimateLineItemInput>;
  notes?: string | null | undefined;
};

export type UpdatePropertyAssessmentInput = {
  accessDifficulty?: string | null | undefined;
  assessmentId: string | number;
  disposalNeeded?: string | null | undefined;
  equipmentNeeded?: string | null | undefined;
  estimatedLaborHours?: number | null | undefined;
  generalNotes?: string | null | undefined;
  materialsNeeded?: string | null | undefined;
  recommendedCrewSize?: number | null | undefined;
  requestedWork?: string | null | undefined;
};

export type AssessmentContextQueryVariables = Exact<{
  consultationId: string | number;
}>;

export type AssessmentContextQuery = {
  assessmentContext: {
    lead: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      requestedServices: Array<{ id: string; serviceType: ServiceType }>;
    };
    property: {
      id: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    consultation: {
      id: string;
      scheduledStart: string;
      completedAt: string | null;
      completionNotes: string | null;
      outcome: ConsultationOutcome | null;
    };
    assessment: { id: string; status: PropertyAssessmentStatus } | null;
  } | null;
};

export type AssessmentDetailsQueryVariables = Exact<{
  id: string | number;
}>;

export type AssessmentDetailsQuery = {
  assessment: {
    id: string;
    status: PropertyAssessmentStatus;
    requestedWork: string | null;
    generalNotes: string | null;
    accessDifficulty: string | null;
    estimatedLaborHours: number | null;
    recommendedCrewSize: number | null;
    materialsNeeded: string | null;
    equipmentNeeded: string | null;
    disposalNeeded: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    lead: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      requestedServices: Array<{ id: string; serviceType: ServiceType }>;
    };
    consultation: {
      id: string;
      scheduledStart: string;
      completedAt: string | null;
      completionNotes: string | null;
      outcome: ConsultationOutcome | null;
    };
    property: {
      id: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      postalCode: string;
    };
    createdBy: { name: string | null; email: string };
  } | null;
};

export type CreatePropertyAssessmentMutationVariables = Exact<{
  input: CreatePropertyAssessmentInput;
}>;

export type CreatePropertyAssessmentMutation = {
  createPropertyAssessment: { id: string; status: PropertyAssessmentStatus };
};

export type UpdatePropertyAssessmentMutationVariables = Exact<{
  input: UpdatePropertyAssessmentInput;
}>;

export type UpdatePropertyAssessmentMutation = {
  updatePropertyAssessment: { id: string; status: PropertyAssessmentStatus; updatedAt: string };
};

export type CompletePropertyAssessmentMutationVariables = Exact<{
  assessmentId: string | number;
}>;

export type CompletePropertyAssessmentMutation = {
  completePropertyAssessment: {
    id: string;
    status: PropertyAssessmentStatus;
    completedAt: string | null;
  };
};

export type ConsultationsQueryVariables = Exact<{
  scope?: ConsultationScope | null | undefined;
}>;

export type ConsultationsQuery = {
  consultations: Array<{
    id: string;
    type: ConsultationType;
    scheduledStart: string;
    scheduledEnd: string;
    status: ConsultationStatus;
    notes: string | null;
    lead: { id: string; firstName: string; lastName: string } | null;
    customer: { id: string; firstName: string; lastName: string } | null;
    property: {
      id: string;
      addressLine1: string;
      city: string;
      state: string;
      postalCode: string;
    } | null;
  }>;
};

export type ConsultationDetailsQueryVariables = Exact<{
  id: string | number;
}>;

export type ConsultationDetailsQuery = {
  consultation: {
    id: string;
    type: ConsultationType;
    scheduledStart: string;
    scheduledEnd: string;
    status: ConsultationStatus;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    completionNotes: string | null;
    actualDuration: number | null;
    outcome: ConsultationOutcome | null;
    lead: { id: string; firstName: string; lastName: string } | null;
    customer: { id: string; firstName: string; lastName: string } | null;
    property: {
      id: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
    createdBy: { name: string | null; email: string };
    assignedUser: { name: string | null; email: string } | null;
    completedBy: { name: string | null; email: string } | null;
  } | null;
};

export type CompleteConsultationMutationVariables = Exact<{
  input: CompleteConsultationInput;
}>;

export type CompleteConsultationMutation = {
  completeConsultation: {
    id: string;
    status: ConsultationStatus;
    completedAt: string | null;
    completionNotes: string | null;
    actualDuration: number | null;
    outcome: ConsultationOutcome | null;
  };
};

export type MarkConsultationLeadLostMutationVariables = Exact<{
  input: MarkConsultationLeadLostInput;
}>;

export type MarkConsultationLeadLostMutation = {
  markConsultationLeadLost: { id: string; status: LeadStatus };
};

export type UpdateConsultationMutationVariables = Exact<{
  input: UpdateConsultationInput;
}>;

export type UpdateConsultationMutation = {
  updateConsultation: {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: ConsultationStatus;
    notes: string | null;
    updatedAt: string;
  };
};

export type CreateLeadMutationVariables = Exact<{
  input: CreateLeadInput;
}>;

export type CreateLeadMutation = {
  createLead: { success: boolean; leadId: string | null; message: string };
};

export type CustomerDetailsQueryVariables = Exact<{
  id: string | number;
}>;

export type CustomerDetailsQuery = {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    createdAt: string;
    organization: { name: string };
    sourceLead: { id: string } | null;
    properties: Array<{
      id: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      postalCode: string;
      accessNotes: string | null;
      createdAt: string;
    }>;
    consultations: Array<{
      id: string;
      scheduledStart: string;
      scheduledEnd: string;
      status: ConsultationStatus;
      type: ConsultationType;
      notes: string | null;
      property: {
        id: string;
        addressLine1: string;
        city: string;
        state: string;
        postalCode: string;
      } | null;
    }>;
  } | null;
};

export type ScheduleConsultationMutationVariables = Exact<{
  input: ScheduleConsultationInput;
}>;

export type ScheduleConsultationMutation = { scheduleConsultation: { id: string } };

export type EstimateContextQueryVariables = Exact<{
  leadId: string | number;
}>;

export type EstimateContextQuery = {
  estimateContext: {
    lead: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      requestedServices: Array<{ id: string; serviceType: ServiceType }>;
    };
    consultation: {
      id: string;
      scheduledStart: string;
      outcome: ConsultationOutcome | null;
    } | null;
    assessment: {
      id: string;
      status: PropertyAssessmentStatus;
      requestedWork: string | null;
      generalNotes: string | null;
      materialsNeeded: string | null;
      equipmentNeeded: string | null;
    } | null;
    estimate: { id: string; status: EstimateStatus; totalCents: number } | null;
  } | null;
};

export type EstimateDetailsQueryVariables = Exact<{
  id: string | number;
}>;

export type EstimateDetailsQuery = {
  estimate: {
    id: string;
    status: EstimateStatus;
    details: string | null;
    notes: string | null;
    totalCents: number;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    lead: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      requestedServices: Array<{ id: string; serviceType: ServiceType }>;
    };
    consultation: {
      id: string;
      scheduledStart: string;
      outcome: ConsultationOutcome | null;
    } | null;
    assessment: {
      id: string;
      status: PropertyAssessmentStatus;
      requestedWork: string | null;
    } | null;
    lineItems: Array<{
      id: string;
      description: string;
      quantity: number;
      unitPriceCents: number;
      totalCents: number;
    }>;
    createdBy: { name: string | null; email: string };
  } | null;
};

export type CreateEstimateMutationVariables = Exact<{
  input: CreateEstimateInput;
}>;

export type CreateEstimateMutation = { createEstimate: { id: string; status: EstimateStatus } };

export type UpdateEstimateMutationVariables = Exact<{
  input: UpdateEstimateInput;
}>;

export type UpdateEstimateMutation = {
  updateEstimate: { id: string; status: EstimateStatus; totalCents: number; updatedAt: string };
};

export type CompleteEstimateMutationVariables = Exact<{
  estimateId: string | number;
}>;

export type CompleteEstimateMutation = {
  completeEstimate: {
    id: string;
    status: EstimateStatus;
    totalCents: number;
    completedAt: string | null;
  };
};

export type HealthQueryVariables = Exact<{ [key: string]: never }>;

export type HealthQuery = { health: { status: string; timestamp: string } };

export type LeadsQueryVariables = Exact<{
  search?: string | null | undefined;
  status?: LeadStatus | null | undefined;
  sort?: LeadSort | null | undefined;
}>;

export type LeadsQuery = {
  leads: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: LeadStatus;
    createdAt: string;
    requestedServices: Array<{ id: string; leadId: string; serviceType: ServiceType }>;
  }>;
};

export type LeadDetailsQueryVariables = Exact<{
  id: string | number;
}>;

export type LeadDetailsQuery = {
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    status: LeadStatus;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    requestedServices: Array<{ id: string; serviceType: ServiceType }>;
    internalNotes: Array<{
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      author: { name: string | null; email: string };
    }>;
    convertedCustomer: { id: string } | null;
    estimate: { id: string; status: EstimateStatus; totalCents: number } | null;
    consultations: Array<{
      id: string;
      type: ConsultationType;
      scheduledStart: string;
      scheduledEnd: string;
      status: ConsultationStatus;
      completedAt: string | null;
      completionNotes: string | null;
      actualDuration: number | null;
      outcome: ConsultationOutcome | null;
      assignedUser: { name: string | null; email: string } | null;
      assessment: { id: string; status: PropertyAssessmentStatus } | null;
    }>;
  } | null;
};

export type ScheduleLeadConsultationMutationVariables = Exact<{
  input: ScheduleLeadConsultationInput;
}>;

export type ScheduleLeadConsultationMutation = { scheduleLeadConsultation: { id: string } };

export type ConvertLeadToCustomerMutationVariables = Exact<{
  leadId: string | number;
}>;

export type ConvertLeadToCustomerMutation = { convertLeadToCustomer: { id: string } };

export type UndoLeadConversionMutationVariables = Exact<{
  leadId: string | number;
}>;

export type UndoLeadConversionMutation = {
  undoLeadConversion: {
    id: string;
    status: LeadStatus;
    updatedAt: string;
    convertedCustomer: { id: string } | null;
  };
};

export type UpdateLeadStatusMutationVariables = Exact<{
  leadId: string | number;
  status: LeadStatus;
}>;

export type UpdateLeadStatusMutation = {
  updateLeadStatus: { id: string; status: LeadStatus; updatedAt: string };
};

export type AddLeadNoteMutationVariables = Exact<{
  leadId: string | number;
  content: string;
}>;

export type AddLeadNoteMutation = {
  addLeadNote: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: { name: string | null; email: string };
  };
};

export const AssessmentContextDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AssessmentContext" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "consultationId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "assessmentContext" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "consultationId" },
                value: { kind: "Variable", name: { kind: "Name", value: "consultationId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requestedServices" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "property" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultation" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "completionNotes" } },
                      { kind: "Field", name: { kind: "Name", value: "outcome" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assessment" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssessmentContextQuery, AssessmentContextQueryVariables>;
export const AssessmentDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AssessmentDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "assessment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "requestedWork" } },
                { kind: "Field", name: { kind: "Name", value: "generalNotes" } },
                { kind: "Field", name: { kind: "Name", value: "accessDifficulty" } },
                { kind: "Field", name: { kind: "Name", value: "estimatedLaborHours" } },
                { kind: "Field", name: { kind: "Name", value: "recommendedCrewSize" } },
                { kind: "Field", name: { kind: "Name", value: "materialsNeeded" } },
                { kind: "Field", name: { kind: "Name", value: "equipmentNeeded" } },
                { kind: "Field", name: { kind: "Name", value: "disposalNeeded" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requestedServices" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultation" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "completionNotes" } },
                      { kind: "Field", name: { kind: "Name", value: "outcome" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "property" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "createdBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssessmentDetailsQuery, AssessmentDetailsQueryVariables>;
export const CreatePropertyAssessmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePropertyAssessment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreatePropertyAssessmentInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPropertyAssessment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePropertyAssessmentMutation,
  CreatePropertyAssessmentMutationVariables
>;
export const UpdatePropertyAssessmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdatePropertyAssessment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UpdatePropertyAssessmentInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updatePropertyAssessment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePropertyAssessmentMutation,
  UpdatePropertyAssessmentMutationVariables
>;
export const CompletePropertyAssessmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CompletePropertyAssessment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "assessmentId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completePropertyAssessment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "assessmentId" },
                value: { kind: "Variable", name: { kind: "Name", value: "assessmentId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CompletePropertyAssessmentMutation,
  CompletePropertyAssessmentMutationVariables
>;
export const ConsultationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Consultations" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "scope" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ConsultationScope" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "consultations" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "scope" },
                value: { kind: "Variable", name: { kind: "Name", value: "scope" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledEnd" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "customer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "property" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConsultationsQuery, ConsultationsQueryVariables>;
export const ConsultationDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ConsultationDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "consultation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledEnd" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "customer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "property" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "createdBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assignedUser" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "completedBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "completionNotes" } },
                { kind: "Field", name: { kind: "Name", value: "actualDuration" } },
                { kind: "Field", name: { kind: "Name", value: "outcome" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConsultationDetailsQuery, ConsultationDetailsQueryVariables>;
export const CompleteConsultationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CompleteConsultation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CompleteConsultationInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completeConsultation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                { kind: "Field", name: { kind: "Name", value: "completionNotes" } },
                { kind: "Field", name: { kind: "Name", value: "actualDuration" } },
                { kind: "Field", name: { kind: "Name", value: "outcome" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompleteConsultationMutation, CompleteConsultationMutationVariables>;
export const MarkConsultationLeadLostDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "MarkConsultationLeadLost" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MarkConsultationLeadLostInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "markConsultationLeadLost" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarkConsultationLeadLostMutation,
  MarkConsultationLeadLostMutationVariables
>;
export const UpdateConsultationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateConsultation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateConsultationInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateConsultation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                { kind: "Field", name: { kind: "Name", value: "scheduledEnd" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateConsultationMutation, UpdateConsultationMutationVariables>;
export const CreateLeadDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateLead" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateLeadInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createLead" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "success" } },
                { kind: "Field", name: { kind: "Name", value: "leadId" } },
                { kind: "Field", name: { kind: "Name", value: "message" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLeadMutation, CreateLeadMutationVariables>;
export const CustomerDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "CustomerDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "customer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "organization" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "sourceLead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "properties" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                      { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                      { kind: "Field", name: { kind: "Name", value: "city" } },
                      { kind: "Field", name: { kind: "Name", value: "state" } },
                      { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                      { kind: "Field", name: { kind: "Name", value: "accessNotes" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      { kind: "Field", name: { kind: "Name", value: "notes" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "property" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                            { kind: "Field", name: { kind: "Name", value: "city" } },
                            { kind: "Field", name: { kind: "Name", value: "state" } },
                            { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CustomerDetailsQuery, CustomerDetailsQueryVariables>;
export const ScheduleConsultationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ScheduleConsultation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ScheduleConsultationInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "scheduleConsultation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ScheduleConsultationMutation, ScheduleConsultationMutationVariables>;
export const EstimateContextDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EstimateContext" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "estimateContext" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "leadId" },
                value: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requestedServices" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultation" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "outcome" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assessment" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "requestedWork" } },
                      { kind: "Field", name: { kind: "Name", value: "generalNotes" } },
                      { kind: "Field", name: { kind: "Name", value: "materialsNeeded" } },
                      { kind: "Field", name: { kind: "Name", value: "equipmentNeeded" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "estimate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EstimateContextQuery, EstimateContextQueryVariables>;
export const EstimateDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EstimateDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "estimate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "details" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      { kind: "Field", name: { kind: "Name", value: "phone" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "requestedServices" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultation" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "outcome" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "assessment" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "requestedWork" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "lineItems" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "quantity" } },
                      { kind: "Field", name: { kind: "Name", value: "unitPriceCents" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "createdBy" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EstimateDetailsQuery, EstimateDetailsQueryVariables>;
export const CreateEstimateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateEstimate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateEstimateInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createEstimate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateEstimateMutation, CreateEstimateMutationVariables>;
export const UpdateEstimateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateEstimate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UpdateEstimateInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateEstimate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateEstimateMutation, UpdateEstimateMutationVariables>;
export const CompleteEstimateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CompleteEstimate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "estimateId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "completeEstimate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "estimateId" },
                value: { kind: "Variable", name: { kind: "Name", value: "estimateId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                { kind: "Field", name: { kind: "Name", value: "completedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CompleteEstimateMutation, CompleteEstimateMutationVariables>;
export const HealthDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Health" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "health" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;
export const LeadsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Leads" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "LeadStatus" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "LeadSort" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "leads" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: { kind: "Variable", name: { kind: "Name", value: "search" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: { kind: "Variable", name: { kind: "Name", value: "sort" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "requestedServices" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "leadId" } },
                      { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LeadsQuery, LeadsQueryVariables>;
export const LeadDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LeadDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "lead" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "phone" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine1" } },
                { kind: "Field", name: { kind: "Name", value: "addressLine2" } },
                { kind: "Field", name: { kind: "Name", value: "city" } },
                { kind: "Field", name: { kind: "Name", value: "state" } },
                { kind: "Field", name: { kind: "Name", value: "postalCode" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "notes" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "requestedServices" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "serviceType" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "internalNotes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "content" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "author" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "convertedCustomer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "estimate" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "totalCents" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "consultations" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "type" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledStart" } },
                      { kind: "Field", name: { kind: "Name", value: "scheduledEnd" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "completedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "completionNotes" } },
                      { kind: "Field", name: { kind: "Name", value: "actualDuration" } },
                      { kind: "Field", name: { kind: "Name", value: "outcome" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "assignedUser" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "assessment" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "status" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LeadDetailsQuery, LeadDetailsQueryVariables>;
export const ScheduleLeadConsultationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ScheduleLeadConsultation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ScheduleLeadConsultationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "scheduleLeadConsultation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ScheduleLeadConsultationMutation,
  ScheduleLeadConsultationMutationVariables
>;
export const ConvertLeadToCustomerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ConvertLeadToCustomer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "convertLeadToCustomer" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "leadId" },
                value: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConvertLeadToCustomerMutation, ConvertLeadToCustomerMutationVariables>;
export const UndoLeadConversionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UndoLeadConversion" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "undoLeadConversion" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "leadId" },
                value: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "convertedCustomer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UndoLeadConversionMutation, UndoLeadConversionMutationVariables>;
export const UpdateLeadStatusDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateLeadStatus" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "status" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "LeadStatus" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateLeadStatus" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "leadId" },
                value: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "status" },
                value: { kind: "Variable", name: { kind: "Name", value: "status" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLeadStatusMutation, UpdateLeadStatusMutationVariables>;
export const AddLeadNoteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddLeadNote" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "content" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addLeadNote" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "leadId" },
                value: { kind: "Variable", name: { kind: "Name", value: "leadId" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "content" },
                value: { kind: "Variable", name: { kind: "Name", value: "content" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "author" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddLeadNoteMutation, AddLeadNoteMutationVariables>;
