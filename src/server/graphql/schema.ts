export const typeDefs = `#graphql
  type Query {
    health: Health!
    leads(search: String, status: LeadStatus, sort: LeadSort = NEWEST): [Lead!]!
    lead(id: ID!): Lead
    customer(id: ID!): Customer
    consultations(scope: ConsultationScope = UPCOMING): [Consultation!]!
    consultation(id: ID!): Consultation
    assessment(id: ID!): PropertyAssessment
    assessmentContext(consultationId: ID!): PropertyAssessmentContext
  }

  type Mutation {
    createLead(input: CreateLeadInput!): CreateLeadPayload!
    updateLeadStatus(leadId: ID!, status: LeadStatus!): Lead!
    addLeadNote(leadId: ID!, content: String!): LeadNote!
    convertLeadToCustomer(leadId: ID!): Customer!
    undoLeadConversion(leadId: ID!): Lead!
    scheduleConsultation(input: ScheduleConsultationInput!): Consultation!
    updateConsultation(input: UpdateConsultationInput!): Consultation!
    scheduleLeadConsultation(input: ScheduleLeadConsultationInput!): Consultation!
    completeConsultation(input: CompleteConsultationInput!): Consultation!
    markConsultationLeadLost(input: MarkConsultationLeadLostInput!): Lead!
    createPropertyAssessment(input: CreatePropertyAssessmentInput!): PropertyAssessment!
    updatePropertyAssessment(input: UpdatePropertyAssessmentInput!): PropertyAssessment!
    completePropertyAssessment(assessmentId: ID!): PropertyAssessment!
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
    consultations: [Consultation!]!
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
    consultations: [Consultation!]!
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

  type Consultation {
    id: ID!
    scheduledStart: String!
    scheduledEnd: String!
    status: ConsultationStatus!
    notes: String
    createdAt: String!
    updatedAt: String!
    type: ConsultationType!
    lead: ConsultationLead
    customer: ConsultationCustomer
    property: Property
    createdBy: LeadNoteAuthor!
    assignedUser: LeadNoteAuthor
    completedAt: String
    completedBy: LeadNoteAuthor
    assessment: PropertyAssessment
    completionNotes: String
    actualDuration: Int
    outcome: ConsultationOutcome
  }
  type ConsultationLead { id: ID!, firstName: String!, lastName: String! }
  type ConsultationCustomer { id: ID!, firstName: String!, lastName: String! }
  input ScheduleConsultationInput { customerId: ID!, propertyId: ID!, scheduledStart: String!, scheduledEnd: String!, notes: String }
  input UpdateConsultationInput { consultationId: ID!, status: ConsultationStatus!, scheduledStart: String!, scheduledEnd: String!, notes: String }
  input ScheduleLeadConsultationInput { leadId: ID!, type: ConsultationType!, scheduledStart: String!, scheduledEnd: String!, notes: String, addressLine1: String, addressLine2: String, city: String, state: String, postalCode: String }
  input CompleteConsultationInput { consultationId: ID!, outcome: ConsultationOutcome!, completionNotes: String, actualDuration: Int }
  input MarkConsultationLeadLostInput { consultationId: ID!, reason: String! }
  enum ConsultationStatus { SCHEDULED COMPLETED CANCELED NO_SHOW }
  enum ConsultationType { ON_SITE PHONE }
  enum ConsultationOutcome { ASSESSMENT_NEEDED READY_FOR_ESTIMATE FOLLOW_UP_NEEDED NOT_A_GOOD_FIT CUSTOMER_NOT_INTERESTED }
  enum ConsultationScope { UPCOMING PAST ALL }

  type PropertyAssessment {
    id: ID!
    status: PropertyAssessmentStatus!
    requestedWork: String
    generalNotes: String
    accessDifficulty: String
    estimatedLaborHours: Float
    recommendedCrewSize: Int
    materialsNeeded: String
    equipmentNeeded: String
    disposalNeeded: String
    createdAt: String!
    updatedAt: String!
    completedAt: String
    lead: Lead!
    consultation: Consultation!
    property: Property!
    createdBy: LeadNoteAuthor!
  }
  type PropertyAssessmentContext {
    consultation: Consultation!
    lead: Lead!
    property: Property!
    assessment: PropertyAssessment
  }
  input CreatePropertyAssessmentInput {
    consultationId: ID!
    requestedWork: String
    generalNotes: String
    accessDifficulty: String
    estimatedLaborHours: Float
    recommendedCrewSize: Int
    materialsNeeded: String
    equipmentNeeded: String
    disposalNeeded: String
  }
  input UpdatePropertyAssessmentInput {
    assessmentId: ID!
    requestedWork: String
    generalNotes: String
    accessDifficulty: String
    estimatedLaborHours: Float
    recommendedCrewSize: Int
    materialsNeeded: String
    equipmentNeeded: String
    disposalNeeded: String
  }
  enum PropertyAssessmentStatus { DRAFT IN_PROGRESS COMPLETED CANCELLED }

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
    CONSULTATION_COMPLETED
    ASSESSMENT_COMPLETED
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
