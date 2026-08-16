# Yard To Table marketing

Static, brand-focused website for Yard To Table Landscaping. This app contains no customer intake,
database access, GraphQL operations, or internal field-service workflows.

The service-request section embeds Trellis's public intake surface. Local development defaults to
`http://localhost:3000`, while production builds default to `https://trellis-software.vercel.app`.
Set `NEXT_PUBLIC_TRELLIS_URL` to override the Trellis origin explicitly.

Run it from the repository root with `npm run dev:ytt`.
