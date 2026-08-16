# Yard To Table marketing

Static, brand-focused website for Yard To Table Landscaping. This app contains no customer intake,
database access, GraphQL operations, or internal field-service workflows.

The service-request section embeds Trellis's public intake surface. Set
`NEXT_PUBLIC_TRELLIS_URL` to the deployed Trellis origin when building this static app. Locally it
defaults to `http://localhost:3000`.

Run it from the repository root with `npm run dev:ytt`.
