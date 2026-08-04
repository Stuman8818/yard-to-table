# Yard to Table

A full-stack field-service and garden-planning platform for lawn-care and residential garden-installation businesses.

Yard to Table is designed to manage the customer lifecycle from initial service request through property assessment, estimating, approval, scheduling, and job completion.

> This project is under active development. Features and documentation will continue to evolve as the initial product is built.

## Overview

Lawn-care and garden-installation businesses often manage leads, property information, estimates, schedules, photographs, and customer communication across disconnected tools.

Yard to Table brings those workflows into one application while adding specialized functionality for residential garden planning.

## Planned Features

- Public lawn-care and garden-service request form
- Lead and customer management
- Multiple properties per customer
- Property assessments and measurements
- Consultation and job scheduling
- Garden-installation estimate builder
- Optional proposal upgrades
- Secure customer approval workflow
- Job creation and status tracking
- Property and project photo management
- Garden-area and planting-capacity calculations

## Initial User Workflow

1. A customer submits a service request.
2. The request is added to the lead-management dashboard.
3. An administrator schedules a property consultation.
4. Property measurements and assessment details are recorded.
5. An estimate is created and sent to the customer.
6. The customer approves or declines the estimate.
7. An approved estimate is converted into a scheduled job.

## Technology Stack

### Application

- Next.js
- React
- TypeScript
- Tailwind CSS

### Planned API and Data Layer

- GraphQL
- Apollo Server
- Apollo Client
- GraphQL Code Generator
- PostgreSQL
- Prisma ORM

### Planned Quality and Delivery Tools

- ESLint
- Prettier
- Vitest
- React Testing Library
- Playwright
- GitHub Actions
- Vercel

## Architecture

The application will follow a feature-oriented architecture with clear separation between presentation, API, business, and data-access concerns.

```text
Next.js interface
       ↓
GraphQL operations
       ↓
GraphQL resolvers
       ↓
Domain services
       ↓
Prisma
       ↓
PostgreSQL
```

GraphQL will support application data such as leads, customers, properties, assessments, estimates, appointments, and jobs. Specialized operations such as file uploads, authentication callbacks, and external webhooks may use dedicated Next.js route handlers.

### Organization-owned data boundary

`Organization` is the root owner for business data. Every `Lead` has a required organization relation, while `LeadService` remains scoped through its parent lead to avoid redundant ownership fields. The initial organization is `Yard To Table` (`yard-to-table`).

For the current single-tenant phase, a centralized server-side resolver looks up that fixed slug. Both public lead creation and lead listing use the resolved organization ID. The public GraphQL input deliberately has no `organizationId`: clients cannot choose ownership, and the server remains the authority for tenant resolution.

This is an initial data boundary, not complete multi-tenancy or tenant isolation. The resolver can later derive the organization from a hostname, subdomain, custom domain, route, or authenticated session. Authentication and organization memberships should be added before protected multi-organization administration; trade-specific modules can then reference the same organization boundary without duplicating applications.

### Authentication and administrator access

Internal accounts are represented by `User`, with globally unique normalized email addresses and bcrypt password hashes. `OrganizationMembership` connects users to organizations with an `OWNER`, `ADMIN`, `MANAGER`, or `CREW` role. A user can eventually have multiple memberships, but until an organization switcher exists the application fails closed when more than one membership is found. Only `OWNER` and `ADMIN` may access `/admin/leads`.

Auth.js handles email-and-password login and encrypted, HTTP-only cookie sessions. Protected pages validate the session on the server, then reload the user's trusted membership from PostgreSQL. The authenticated GraphQL lead query uses that membership's organization ID directly in its Prisma `where` clause. It never accepts a user ID, membership, organization ID, or role from the GraphQL client. The public lead-intake mutation remains unauthenticated and continues to use the separate fixed-slug public organization resolver.

Create a cryptographically random Auth.js secret for each deployed environment. To seed the first administrator, set both seed credentials and run `npm run db:seed` manually after migrations:

```text
AUTH_SECRET=<random deployment secret>
SEED_ADMIN_EMAIL=<internal administrator email>
SEED_ADMIN_PASSWORD=<initial password of at least 12 characters>
SEED_ADMIN_NAME=<optional display name>
```

`AUTH_SECRET` is required locally and in production. Automated tests may use a disposable test-only value. `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are only needed for the explicit initial-admin seed; production startup and deployment do not run that seed. Re-running it does not replace an existing password or duplicate the membership.

This phase does not include public registration, invitations, organization switching, password reset, full lead management, customer accounts, or crew-facing workflows.

### Lead management

The authenticated admin application provides tenant-scoped lead listing and details. List searches match first name, last name, email, or phone case-insensitively; status filtering uses `LeadStatus`; and results may be ordered newest or oldest. All filtering happens in PostgreSQL after the authenticated organization constraint is applied.

Lead details are retrieved with both the requested lead ID and the organization ID resolved from the authenticated membership. Cross-organization IDs therefore return the same safe not-found result as unknown IDs. Status mutations use a tenant-scoped `updateMany`, and internal notes verify the scoped parent lead before recording the authenticated user as author. The public submission message remains in `Lead.notes`; internal history is stored separately in `LeadNote` and cannot be edited or deleted in this phase.

`OWNER` and `ADMIN` memberships can view and modify leads. `MANAGER` memberships have read-only lead access, while `CREW` memberships are denied. Client requests never supply organization IDs, user IDs, membership IDs, or roles.

Current lead-management limitations include no scheduling, estimates, jobs, invoices, note editing/deletion, pagination, or bulk actions.

### Lead conversion and customers

Owners and administrators can convert a tenant-scoped lead into a customer and first property. The conversion runs in one PostgreSQL transaction, copies only the lead's existing contact and address data, marks the lead `CONVERTED`, and redirects to a read-only customer record. A unique source-lead relationship makes retries idempotent and prevents duplicate customers.

Customers and properties each have required organization ownership. Composite foreign keys ensure a customer cannot originate from another organization's lead and a property cannot belong to another organization's customer. Customer retrieval always uses both the requested ID and the authenticated membership's organization ID. Managers retain read-only access; crew members cannot access lead or customer administration.

This phase does not include customer or property editing, a multiple-property creation UI, estimates, jobs, billing, or a customer portal.

### Consultations

Owners and administrators can schedule a consultation for one of a customer's tenant-owned properties, then reschedule it, update its notes, or move it through `SCHEDULED`, `COMPLETED`, `CANCELED`, and `NO_SHOW`. Managers have read-only access and crew members are denied. Upcoming, past, and complete history views retain completed and canceled appointments.

Consultations belong independently to the organization, customer, and property, with composite PostgreSQL foreign keys preventing cross-tenant or mismatched customer/property records. The authenticated user is recorded as creator; client requests cannot choose organization, creator, or role. Consultations remain separate from jobs because an appointment can be canceled, missed, or completed without becoming contracted work.

This phase intentionally excludes property assessments, estimates, jobs, calendar integrations, notifications, and recurring appointments.

## Project Structure

```text
src/
├── app/
├── components/
├── features/
├── graphql/
├── lib/
├── server/
└── types/
```

The structure will be expanded and documented as the application architecture is implemented.

## Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL or access to a managed PostgreSQL database

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/yard-to-table.git
cd yard-to-table
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Additional testing, type-checking, formatting, GraphQL code-generation, and end-to-end scripts will be added as those tools are configured.

## Testing Strategy

The planned testing strategy includes:

- Unit tests for pricing, measurements, validation, and status rules
- Component tests for forms and interactive interfaces
- Integration tests for GraphQL resolvers and database operations
- End-to-end tests for the complete lead-to-job workflow

## CI/CD

The planned delivery workflow is:

```text
Feature branch
      ↓
Pull request
      ↓
GitHub Actions validation
      ↓
Vercel preview deployment
      ↓
Merge to main
      ↓
Production deployment
```

Pull requests will eventually run formatting, linting, TypeScript, tests, GraphQL generation checks, and production builds.

## Security

This repository must not contain:

- Production credentials
- API keys
- Authentication secrets
- Database passwords
- Real customer information
- Private addresses or property photographs

Required environment-variable names are documented in `.env.example`. Actual values must remain in ignored local environment files or deployment-platform secret storage.

## Roadmap

### Milestone 1 — Repository Foundation

- [x] Create the public repository
- [x] Add environment-variable documentation
- [ ] Add the initial application through a pull request
- [ ] Configure strict TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Add continuous integration
- [ ] Connect Vercel preview deployments

### Milestone 2 — Application Foundation

- [ ] Add PostgreSQL and Prisma
- [ ] Add authentication
- [ ] Add organization and user models
- [ ] Create the administration dashboard
- [ ] Add seed data

### Milestone 3 — GraphQL Foundation

- [ ] Add Apollo Server
- [ ] Add Apollo Client
- [ ] Define the initial GraphQL schema
- [ ] Configure GraphQL Code Generator
- [ ] Add resolver tests

### Milestone 4 — Lead Management

- [ ] Build the public service-request form
- [ ] Store leads through GraphQL
- [ ] Build the lead dashboard
- [ ] Add status management
- [ ] Add activity history

### Milestone 5 — Estimates and Jobs

- [ ] Build customer and property records
- [ ] Add property assessments
- [ ] Build the estimate editor
- [ ] Add customer approval
- [ ] Convert approved estimates into jobs

## Project Status

The application is currently in active development and is not ready for production use.

## Author

**Dave Stewart**

Software Engineer specializing in front-end and full-stack web application development.

- LinkedIn: Add link
- Portfolio: Add link
- GitHub: Add link

## License

A license has not yet been selected.
