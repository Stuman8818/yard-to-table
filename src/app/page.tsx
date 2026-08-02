import ContactForm from "@/components/home/ContactForm";
import { Header } from "@/components/Header";
import { serviceDefinitions, type ServiceType } from "@/lib/services";

const productSteps = [
  {
    number: "01",
    title: "Understand the property",
    description: "Capture the property, goals, access details, measurements, and seasonal needs.",
  },
  {
    number: "02",
    title: "Create the right plan",
    description:
      "Connect lawn care, garden design, installation ideas, and maintenance around the same outdoor space.",
  },
  {
    number: "03",
    title: "Manage what comes next",
    description:
      "Keep assessments, recommendations, estimates, projects, and future care organized in one place.",
  },
];

const roadmap = [
  {
    phase: "Now",
    title: "Business and product foundation",
    description:
      "Build the lead workflow, property model, launch identity, service definitions, and operational application.",
    active: true,
  },
  {
    phase: "Next",
    title: "Pilot preparation",
    description:
      "Prepare lawn-care operations, property assessments, consultations, estimates, and an initial Indiana service area.",
    active: false,
  },
  {
    phase: "Later",
    title: "Garden installation and ongoing care",
    description:
      "Expand into garden planning, installation tracking, seasonal maintenance, customer approvals, and long-term property history.",
    active: false,
  },
];

const serviceEntries = Object.entries(serviceDefinitions) as [
  ServiceType,
  (typeof serviceDefinitions)[ServiceType],
][];

const operatingPlatformFeatures = [
  [
    "Organized property records",
    "A shared foundation for property details, service interests, photos, and future work.",
    "In development",
  ],
  [
    "Structured assessments",
    "Consistent property observations and recommendations instead of disconnected notes.",
    "Planned",
  ],
  [
    "Clear estimates and plans",
    "A future workflow for turning assessments into understandable scopes and next steps.",
    "Planned",
  ],
  [
    "Long-term yard history",
    "One place to build context across lawn care, garden projects, and changing seasons.",
    "Planned",
  ],
] as const;

const engineeringOutcomes = [
  "Typed GraphQL lead-submission workflow",
  "Shared client and server validation",
  "Prisma service-layer architecture",
  "Separate development and production databases",
  "Secure server-side email notifications",
  "Automated quality checks with GitHub Actions",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#1e2923]">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#173f32] pt-28 text-white sm:pt-32">
          <div className="pointer-events-none absolute inset-0 hero-grid opacity-20" />
          <div className="relative mx-auto grid max-w-[1200px] gap-14 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b9d4bd]/40 bg-white/5 px-3 py-1.5 text-sm font-semibold text-[#dcebdc]">
                <span className="h-2 w-2 rounded-full bg-[#b7d36b]" aria-hidden="true" />
                Currently in development
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#b9d4bd]">
                Lawn care and garden services—launching soon
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance sm:text-6xl">
                A better way to care for your yard and grow what comes next.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#d5e1d9]">
                Yard To Table is building a local lawn-care, garden-planning, and installation
                service supported by a custom property-management application.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#b9c9bf]">
                We are currently preparing for launch in Indiana. Services are not yet available,
                but you can join the early interest list and follow the build.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a className="button-primary" href="#services">
                  Explore planned services
                  <ArrowIcon />
                </a>
                <a className="button-secondary-dark" href="#interest">
                  Join the interest list
                </a>
              </div>
            </div>

            <div>
              <ProductPreview />
              <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#a9c3b0]">
                Powered by the Yard To Table operating platform
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 border-b border-[#dfe4db] bg-[#fbfaf6]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
            <SectionIntro
              eyebrow="How Yard To Table works"
              title="From the first property visit to ongoing care."
              description="The planned service experience connects what a homeowner needs today with an organized view of the property and what it may need next."
            />
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#dfe4db] bg-[#dfe4db] lg:grid-cols-3">
              {productSteps.map((step) => (
                <article key={step.number} className="bg-white p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#607468]">{step.number}</span>
                    <span className="h-px w-12 bg-[#b8c8bb]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[#5b6860]">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 bg-[#edf2e9]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div>
                <SectionIntro
                  eyebrow="Planned services"
                  title="Practical services built around the whole property."
                  description="Yard To Table plans to begin with dependable lawn care and expand into garden consultation, installation, and ongoing seasonal support."
                />
                <div className="mt-8 rounded-xl border border-[#ccd8ca] bg-[#e4eadf] p-5 text-sm leading-6 text-[#526158]">
                  <strong className="block font-semibold text-[#244436]">Pre-launch note</strong>
                  These services are still being prepared and are not currently available for
                  purchase or scheduling.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {serviceEntries.map(([value, service], index) => (
                  <article
                    key={value}
                    className="group rounded-xl border border-[#d5ded2] bg-[#fbfcf8] p-6 transition-colors hover:border-[#9eb49f]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <ServiceIcon index={index} />
                      <span className="rounded-full bg-[#e5ebe2] px-2.5 py-1 text-xs font-semibold text-[#52665a]">
                        {value === "LAWN_CARE"
                          ? "Launch service"
                          : value === "GARDEN_MAINTENANCE"
                            ? "Future offering"
                            : "Planned"}
                      </span>
                    </div>
                    <h3 className="mt-7 text-lg font-semibold tracking-[-0.01em]">
                      {service.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#607067]">{service.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="scroll-mt-24 border-b border-[#dfe4db] bg-[#fbfaf6]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
            <SectionIntro
              eyebrow="Built differently"
              title="A service company powered by its own software."
              description="Instead of managing leads, property notes, assessments, estimates, photos, and seasonal plans across disconnected tools, Yard To Table is building one application around the entire customer and property journey."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {operatingPlatformFeatures.map(([title, description, status]) => (
                <article key={title} className="rounded-xl border border-[#dce2da] bg-white p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#617468]">
                    {status}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.015em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#637068]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e8eee5]">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow">Behind the build</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                A production-minded full-stack application.
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-[#59675e]">
                Next.js, TypeScript, GraphQL, Apollo, Prisma, Neon Postgres, Zod, Resend, GitHub
                Actions, and Vercel support a realistic business workflow—not a static demo.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {engineeringOutcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-3 border-t border-[#cbd7ca] pt-3 text-sm font-medium text-[#405247]"
                >
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6d8d72]"
                    aria-hidden="true"
                  />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24 bg-[#203b31] text-white">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <p className="eyebrow text-[#a9c6ae]">Business and product roadmap</p>
                <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                  Building the operational layer, one phase at a time.
                </h2>
                <p className="mt-6 max-w-md leading-7 text-[#c7d4cb]">
                  These planned phases bring the service company and its operating application
                  forward together. They are direction—not promises of availability or timing.
                </p>
                <a
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-[#d7e8d8]"
                  href="/garden-planner"
                >
                  Explore the garden planner
                  <ArrowIcon />
                </a>
              </div>

              <ol className="border-l border-white/20">
                {roadmap.map((item) => (
                  <li
                    key={item.phase}
                    className="relative border-b border-white/15 py-7 pl-8 first:pt-1 last:border-0"
                  >
                    <span
                      className={`absolute -left-[5px] top-9 h-2.5 w-2.5 rounded-full ${item.active ? "bg-[#b7d36b]" : "bg-[#70867a]"}`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#9fb5a5]">
                        {item.phase}
                      </span>
                    </div>
                    <p className="mt-2 max-w-xl leading-7 text-[#bdcbc1]">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="interest" className="scroll-mt-24 bg-[#f6f4ed]">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow">Early interest</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                Interested in future Yard To Table services?
              </h2>
              <p className="mt-6 leading-7 text-[#59665e]">
                Tell us which lawn or garden services would be useful for your property. This form
                helps shape the initial launch and does not schedule or purchase a service.
              </p>
              <div className="mt-8 border-l-2 border-[#91a994] pl-5 text-sm leading-6 text-[#647169]">
                Yard To Table is currently preparing for an Indiana launch. Availability, pricing,
                and timing have not yet been announced.
              </div>
            </div>
            <div className="rounded-2xl border border-[#d9ded6] bg-white p-5 shadow-[0_20px_60px_rgba(32,59,49,0.08)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8ddd5] bg-[#eef0e9]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-[-0.02em]">Yard To Table</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#647068]">
              Yard To Table is a pre-launch lawn-care and garden-services company building a custom
              platform for property planning, service operations, and long-term care.
            </p>
            <p className="mt-1 max-w-md text-xs leading-5 text-[#79837d]">
              The application also serves as a full-stack software engineering case study.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm md:items-end">
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#platform">The platform</a>
              <a href="#services">Services</a>
              <a href="#roadmap">Roadmap</a>
              <a href="#interest">Early interest</a>
            </nav>
            <p className="text-xs text-[#79837d]">© 2026 Yard To Table. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-xl leading-7 text-[#5b6860]">{description}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}

function ServiceIcon({ index }: { index: number }) {
  const paths = [
    "M4 17c5-1 8-5 9-12 4 5 3 12-3 14M4 17c2-4 5-7 9-9",
    "M6 17V9m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 3c0-3-2-5-5-5 0 3 2 5 5 5Z",
    "M3 18h14M5 18v-7h10v7M8 11V7h4v4M7 15h2m2 0h2",
  ];
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#cbd8c9] bg-[#edf3e9] text-[#365b46]">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-5 w-5 fill-none stroke-current stroke-[1.5]"
      >
        <path d={paths[index % paths.length]} />
      </svg>
    </span>
  );
}

function ProductPreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-[540px]"
      aria-label="Concept preview of the internal Yard To Table property-planning system"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-[#82a489]/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#f7f6ef] p-3 shadow-[0_32px_80px_rgba(7,27,20,0.35)] sm:p-4">
        <div className="flex items-center justify-between border-b border-[#dfe4db] px-2 pb-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#d7aa83]" />
            <span className="h-2 w-2 rounded-full bg-[#d8d28e]" />
            <span className="h-2 w-2 rounded-full bg-[#8eae91]" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#68766d]">
            Property plan
          </span>
        </div>
        <div className="grid gap-3 pt-3 sm:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-72 overflow-hidden rounded-xl bg-[#dce8d7] p-5 sm:min-h-96">
            <div className="absolute inset-x-0 top-0 h-28 bg-[#c9ddcc]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 320 300"
              className="absolute inset-0 h-full w-full"
            >
              <path d="M0 240 96 128l85 48 139-95v219H0Z" fill="#b8c9a7" />
              <path d="m0 265 106-112 70 48L320 111v189H0Z" fill="#8fab82" />
              <path d="m38 300 78-123 60 39 66-43 78 56v71Z" fill="#6f946e" />
              <path d="M133 178 228 300h-66L98 198Z" fill="#ede5cf" opacity=".9" />
              <rect x="34" y="126" width="92" height="70" rx="4" fill="#f7f1df" />
              <path d="m25 134 55-43 56 43" fill="#b56f51" />
              <rect x="70" y="158" width="24" height="38" fill="#8d684d" />
            </svg>
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6d796f]">
                North yard
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#263e32]">3 planning zones</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            {[
              ["Sun exposure", "6–8 hours"],
              ["Lawn plan", "Concept ready"],
              ["Garden zone", "Raised beds"],
              ["Next review", "Spring"],
            ].map(([label, value], index) => (
              <div key={label} className="rounded-xl border border-[#dfe4db] bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`h-2 w-2 rounded-full ${index === 1 ? "bg-[#b7d36b]" : "bg-[#8ba58e]"}`}
                  />
                  <span className="font-mono text-[9px] text-[#879189]">0{index + 1}</span>
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.1em] text-[#78847b]">
                  {label}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#2d4136]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
