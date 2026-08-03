/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateLead($input: CreateLeadInput!) {\n  createLead(input: $input) {\n    success\n    leadId\n    message\n  }\n}": typeof types.CreateLeadDocument,
    "query Health {\n  health {\n    status\n    timestamp\n  }\n}": typeof types.HealthDocument,
    "query Leads($search: String, $status: LeadStatus, $sort: LeadSort) {\n  leads(search: $search, status: $status, sort: $sort) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    status\n    createdAt\n    requestedServices {\n      id\n      leadId\n      serviceType\n    }\n  }\n}\n\nquery LeadDetails($id: ID!) {\n  lead(id: $id) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    status\n    notes\n    createdAt\n    updatedAt\n    requestedServices {\n      id\n      serviceType\n    }\n    internalNotes {\n      id\n      content\n      createdAt\n      updatedAt\n      author {\n        name\n        email\n      }\n    }\n  }\n}\n\nmutation UpdateLeadStatus($leadId: ID!, $status: LeadStatus!) {\n  updateLeadStatus(leadId: $leadId, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}\n\nmutation AddLeadNote($leadId: ID!, $content: String!) {\n  addLeadNote(leadId: $leadId, content: $content) {\n    id\n    content\n    createdAt\n    updatedAt\n    author {\n      name\n      email\n    }\n  }\n}": typeof types.LeadsDocument,
};
const documents: Documents = {
    "mutation CreateLead($input: CreateLeadInput!) {\n  createLead(input: $input) {\n    success\n    leadId\n    message\n  }\n}": types.CreateLeadDocument,
    "query Health {\n  health {\n    status\n    timestamp\n  }\n}": types.HealthDocument,
    "query Leads($search: String, $status: LeadStatus, $sort: LeadSort) {\n  leads(search: $search, status: $status, sort: $sort) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    status\n    createdAt\n    requestedServices {\n      id\n      leadId\n      serviceType\n    }\n  }\n}\n\nquery LeadDetails($id: ID!) {\n  lead(id: $id) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    status\n    notes\n    createdAt\n    updatedAt\n    requestedServices {\n      id\n      serviceType\n    }\n    internalNotes {\n      id\n      content\n      createdAt\n      updatedAt\n      author {\n        name\n        email\n      }\n    }\n  }\n}\n\nmutation UpdateLeadStatus($leadId: ID!, $status: LeadStatus!) {\n  updateLeadStatus(leadId: $leadId, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}\n\nmutation AddLeadNote($leadId: ID!, $content: String!) {\n  addLeadNote(leadId: $leadId, content: $content) {\n    id\n    content\n    createdAt\n    updatedAt\n    author {\n      name\n      email\n    }\n  }\n}": types.LeadsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLead($input: CreateLeadInput!) {\n  createLead(input: $input) {\n    success\n    leadId\n    message\n  }\n}"): (typeof documents)["mutation CreateLead($input: CreateLeadInput!) {\n  createLead(input: $input) {\n    success\n    leadId\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Health {\n  health {\n    status\n    timestamp\n  }\n}"): (typeof documents)["query Health {\n  health {\n    status\n    timestamp\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Leads($search: String, $status: LeadStatus, $sort: LeadSort) {\n  leads(search: $search, status: $status, sort: $sort) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    status\n    createdAt\n    requestedServices {\n      id\n      leadId\n      serviceType\n    }\n  }\n}\n\nquery LeadDetails($id: ID!) {\n  lead(id: $id) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    status\n    notes\n    createdAt\n    updatedAt\n    requestedServices {\n      id\n      serviceType\n    }\n    internalNotes {\n      id\n      content\n      createdAt\n      updatedAt\n      author {\n        name\n        email\n      }\n    }\n  }\n}\n\nmutation UpdateLeadStatus($leadId: ID!, $status: LeadStatus!) {\n  updateLeadStatus(leadId: $leadId, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}\n\nmutation AddLeadNote($leadId: ID!, $content: String!) {\n  addLeadNote(leadId: $leadId, content: $content) {\n    id\n    content\n    createdAt\n    updatedAt\n    author {\n      name\n      email\n    }\n  }\n}"): (typeof documents)["query Leads($search: String, $status: LeadStatus, $sort: LeadSort) {\n  leads(search: $search, status: $status, sort: $sort) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    status\n    createdAt\n    requestedServices {\n      id\n      leadId\n      serviceType\n    }\n  }\n}\n\nquery LeadDetails($id: ID!) {\n  lead(id: $id) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    addressLine1\n    addressLine2\n    city\n    state\n    postalCode\n    status\n    notes\n    createdAt\n    updatedAt\n    requestedServices {\n      id\n      serviceType\n    }\n    internalNotes {\n      id\n      content\n      createdAt\n      updatedAt\n      author {\n        name\n        email\n      }\n    }\n  }\n}\n\nmutation UpdateLeadStatus($leadId: ID!, $status: LeadStatus!) {\n  updateLeadStatus(leadId: $leadId, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}\n\nmutation AddLeadNote($leadId: ID!, $content: String!) {\n  addLeadNote(leadId: $leadId, content: $content) {\n    id\n    content\n    createdAt\n    updatedAt\n    author {\n      name\n      email\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;