# AGENTS.md

## Project Overview

Yard To Table is a multi-tenant landscaping business management application built with Next.js.

The product is designed for small and midsized landscaping companies. It should help businesses manage the workflow from initial customer request through consultation, estimating, job completion, invoicing, and profitability tracking.

The core workflow is:

```text
Request
→ Lead
→ Consultation
→ Property Assessment
→ Estimate
→ Customer Approval
→ Job
→ Visit
→ Invoice
→ Payment
```

Garden planning is an important future differentiator, but the core landscaping business workflow should be completed first.

## Product Direction

Build a product that is:

- Simple
- Effective
- Easy to learn
- Mobile-friendly
- Affordable to operate
- Specific to landscaping businesses

Avoid unnecessary complexity and excessive customization.

Do not build features simply because competing products include them. Every feature should help a landscaping company win work, complete work, communicate clearly, or understand profitability.

## Multi-Tenant Requirements

All business data belongs to an organization.

Organization-owned records must be securely scoped to the authenticated user’s organization.

Examples include:

- Leads
- Customers
- Properties
- Consultations
- Assessments
- Estimates
- Jobs
- Visits
- Invoices
- Employees
- Services
- Files
- Settings

Never rely only on client-side filtering for tenant isolation.

Authorization must be enforced on the server before reading or modifying organization-owned data.

Public forms must resolve the organization on the server from a safe public identifier such as an organization slug.

Do not trust a client-provided `organizationId`.

## Current Development Priority

The current feature area is consultation scheduling.

Consultations should connect leads to property assessments and estimates.

Keep the workflow simple and support:

- Scheduling from a lead
- Assigned employees
- Consultation type
- Start time and expected duration
- Status
- Internal preparation notes
- Rescheduling
- Cancellation
- Completion
- Activity history
- Email confirmation and reminders
- Clear next actions after completion

Do not add Google Calendar synchronization, embedded maps, route optimization, SMS, or customer-selected live availability unless explicitly requested.

## Lead Capture Direction

Each subscriber should eventually receive a hosted public request page such as:

```text
/request/company-slug
```

The public page should:

- Display the correct company
- Show organization-specific services
- Work without authentication
- Work well on mobile
- Create leads for the correct organization
- Track the lead source
- Include basic spam protection

Subscribers should be able to share the request page through:

- Their website
- Google Business Profile
- Social media
- QR codes
- Flyers
- Yard signs
- Trucks
- Email signatures

Prefer a simple shareable link over complex third-party lead integrations.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- GraphQL
- Apollo Server
- Apollo Client where appropriate
- Prisma
- PostgreSQL
- Neon Postgres
- Zod
- Vitest
- Resend for transactional email

## Coding Rules

- Use TypeScript for all new code.
- Avoid `any` unless clearly justified.
- Use Tailwind CSS for styling.
- Keep components small and reusable.
- Prefer React Server Components unless client-side interactivity is required.
- Keep business logic outside UI components.
- Use service-layer functions for database mutations and workflow logic.
- Validate inputs with Zod.
- Validate again on the server even when client validation exists.
- Use semantic and accessible HTML.
- Add loading, empty, success, and error states where appropriate.
- Do not hardcode secrets.
- Use environment variables for secrets, database URLs, and API keys.
- Do not expose private environment variables to the browser.
- Do not add large dependencies without explaining why they are necessary.
- Use transactions when multiple database changes must succeed or fail together.
- Add confirmation before destructive actions.
- Prefer reversible status changes over permanent deletion.
- Preserve activity history for meaningful workflow changes.
- Paginate potentially large lists.
- Select only the database fields needed by the current view.
- Add indexes for common organization-scoped queries.

## UX Rules

- Optimize common workflows for mobile and desktop.
- Use plain landscaping and business language.
- Minimize required fields.
- Allow incomplete lead records when only limited contact information is known.
- Avoid giant forms when information can be collected progressively.
- Preserve entered form data when validation fails.
- Use sensible defaults.
- Make the most likely next action obvious.
- Make accidental actions correctable where possible.
- Keep crew workflows simpler than administrative workflows.
- Do not require users to understand technical terminology.

## External Services

Avoid expensive or maintenance-heavy integrations during the early product stages.

Prefer simple alternatives when possible.

Examples:

- Use an `Open in Maps` link instead of embedding Google Maps.
- Use email before SMS.
- Use a responsive web application before native mobile applications.
- Use CSV import before building many direct integrations.
- Use printable web views before adding complex document services.

Before adding an integration, consider:

1. Is it necessary for the core workflow?
2. Can the need be solved with a link, export, or manual step?
3. Does it introduce recurring costs?
4. Will it create significant support or maintenance work?
5. Have real customers requested it repeatedly?

## Notifications

Use email for early notifications.

Examples include:

- New lead notifications
- Public request confirmations
- Consultation confirmations
- Consultation reminders
- Estimate notifications
- Invoice notifications

The main business operation should succeed before sending the email.

For example, create the lead first and then attempt the notification.

A failed email should not cause the form submission or database operation to fail.

## Security and Reliability

- Enforce strict organization isolation.
- Protect authenticated routes.
- Enforce role-based authorization on the server.
- Hash passwords securely.
- Rate-limit public mutations.
- Do not expose internal errors to public users.
- Do not return private organization data from public queries.
- Add tests for tenant isolation.
- Add tests for important calculations and workflow transitions.
- Use safe database migrations.
- Never commit secrets.
- Add logging for failed notifications and unexpected errors.

## Testing Priorities

Prioritize tests for:

- Organization isolation
- Authorization
- Consultation scheduling
- Lead conversion
- Recurring visits
- Estimate totals
- Invoice totals
- Profitability calculations
- Public form submissions
- Cross-organization service validation

Test business behavior rather than only implementation details.

## Early Product Non-Goals

Do not prioritize these unless explicitly requested:

- Generic support for unrelated service industries
- Native mobile applications
- Embedded mapping
- Route optimization
- Full accounting software
- Payroll processing
- AI receptionist
- Full marketing automation
- Website builder
- Social media management
- Large integration marketplace
- Advanced CAD-style garden design

## Decision Guideline

When several implementation approaches are possible, prefer the option that is:

1. Simplest for the user
2. Safest for multi-tenant data
3. Cheapest to operate
4. Easiest to maintain
5. Easy to expand later without overbuilding now
