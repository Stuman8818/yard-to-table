export const typeDefs = `#graphql
  type Query {
    health: Health!
    leads: [Lead!]!
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
    LAWN_MOWING
    TRIMMING_EDGING
    YARD_CLEANUP
    GARDEN_CONSULTATION
    GARDEN_DESIGN
    GARDEN_INSTALLATION
    RAISED_BED_INSTALLATION
    GARDEN_MAINTENANCE
  }
`;
