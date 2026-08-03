export const typeDefs = `#graphql
  type Query {
    health: Health!
    leads(search: String, status: LeadStatus, sort: LeadSort = NEWEST): [Lead!]!
    lead(id: ID!): Lead
    customer(id: ID!): Customer
  }

  type Mutation {
    createLead(input: CreateLeadInput!): CreateLeadPayload!
    updateLeadStatus(leadId: ID!, status: LeadStatus!): Lead!
    addLeadNote(leadId: ID!, content: String!): LeadNote!
    convertLeadToCustomer(leadId: ID!): Customer!
  }

  input CreateLeadInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    city: String!
    state: String!
    postalCode: String!
    serviceTypes: [ServiceType!]!
    message: String!
  }

  type CreateLeadPayload {
    success: Boolean!
    leadId: ID
    message: String!
  }

  type Health {
    status: String!
    timestamp: String!
  }

  type Lead {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    preferredContactMethod: String
    status: LeadStatus!
    notes: String
    createdAt: String!
    updatedAt: String!
    requestedServices: [LeadService!]!
    internalNotes: [LeadNote!]!
    convertedCustomer: Customer
  }

  type Customer {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    createdAt: String!
    updatedAt: String!
    organization: CustomerOrganization!
    sourceLead: CustomerSourceLead
    properties: [Property!]!
  }

  type CustomerOrganization { name: String! }
  type CustomerSourceLead { id: ID! }

  type Property {
    id: ID!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    accessNotes: String
    createdAt: String!
    updatedAt: String!
  }

  type LeadNote {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    author: LeadNoteAuthor!
  }

  type LeadNoteAuthor {
    name: String
    email: String!
  }

  type LeadService {
    id: ID!
    leadId: ID!
    serviceType: ServiceType!
  }

  enum LeadStatus {
    NEW
    CONTACTED
    CONSULTATION_SCHEDULED
    ESTIMATE_SENT
    CONVERTED
    LOST
  }

  enum LeadSort {
    NEWEST
    OLDEST
  }

  enum ServiceType {
    LAWN_CARE
    GARDEN_CONSULTATION
    GARDEN_DESIGN
    GARDEN_INSTALLATION
    RAISED_BED_INSTALLATION
    GARDEN_MAINTENANCE
  }
`;
