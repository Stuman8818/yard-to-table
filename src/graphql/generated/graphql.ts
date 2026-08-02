/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type LeadStatus =
  "CONSULTATION_SCHEDULED" | "CONTACTED" | "CONVERTED" | "ESTIMATE_SENT" | "LOST" | "NEW";

export type ServiceType =
  | "GARDEN_CONSULTATION"
  | "GARDEN_DESIGN"
  | "GARDEN_INSTALLATION"
  | "GARDEN_MAINTENANCE"
  | "LAWN_MOWING"
  | "RAISED_BED_INSTALLATION"
  | "TRIMMING_EDGING"
  | "YARD_CLEANUP";

export type HealthQueryVariables = Exact<{ [key: string]: never }>;

export type HealthQuery = { health: { status: string; timestamp: string } };

export type LeadsQueryVariables = Exact<{ [key: string]: never }>;

export type LeadsQuery = {
  leads: Array<{
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
    preferredContactMethod: string | null;
    status: LeadStatus;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    requestedServices: Array<{ id: string; leadId: string; serviceType: ServiceType }>;
  }>;
};

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
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "leads" },
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
                { kind: "Field", name: { kind: "Name", value: "preferredContactMethod" } },
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
