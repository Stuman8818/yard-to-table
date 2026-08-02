export const typeDefs = `#graphql
  type Query {
    health: Health!
    leads: [Lead!]!
  }

  type Mutation {
    createLead(input: CreateLeadInput!): CreateLeadPayload!
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

  enum ServiceType {
    LAWN_CARE
    GARDEN_CONSULTATION
    GARDEN_DESIGN
    GARDEN_INSTALLATION
    RAISED_BED_INSTALLATION
    GARDEN_MAINTENANCE
  }
`;
