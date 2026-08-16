import Image from "next/image";

import { TrellisIntakeEmbed } from "../components/TrellisIntakeEmbed";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDB7utH_-bZozzVFXNk58mG8QKJpUgkBeuyRdrte5791aWCzUxeEKrOy8wl7uXQFD4ZxzCdMmIz5G896tEC8nqYPcD6hjqmI2ViVrUIF32nMT9VygQa-4QdYKflMDHfuNX6rB42rPEwJxgIZX7J1IJ_aRPizuer_A2kA6rACTd332XbCnMZUSK_kDQP6RCFKCGESuv7QowjQVWJ3V0hGBIriH_-88oiT0d-sQ6ee9WZ_6CDSMnJlLzcLw";
const approachImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWc60Uqr-qrPfFxybuYASK6angIGQaSRDeRORs01xHPJRgONNeivLZUCu8A5066WKJPgxrNWQ04cqLd5uIZ5DRssYaYThxMKCmT1HndW3Y6WZM23a2Dy2Cs9JoZCc-kOvlrFuW9mDUnhgWrH4QUeCICNn0hbfjIpztIVIMguxa9kSmOYkSn3rJfcwibyGtLyvAUdlpVGELitquTqV6CoORrJImvru3PnP2XdpO8n6SxhlCZqrF6ENLmA";

const services = [
  {
    title: "Lawn maintenance",
    description:
      "Reliable recurring lawn care that keeps your property clean, trimmed, and consistently maintained.",
    items: ["Weekly mowing", "String trimming", "Edging", "Blowing", "Hedge trimming"],
  },
  {
    title: "Landscape maintenance",
    description:
      "Ongoing and seasonal care for landscape beds, shrubs, and the areas around your home.",
    items: [
      "Mulch installation",
      "Bed edging",
      "Weeding & shrub trimming",
      "Spring & fall cleanup",
      "Plant replacement",
    ],
  },
  {
    title: "Landscape installation",
    description:
      "Improve your property with new beds, plants, and landscape features designed to fit your home.",
    items: [
      "New landscape beds",
      "Bed expansion",
      "Flowers and perennials",
      "Shrubs & small ornamentals",
      "Mulch installation",
    ],
  },
  {
    title: "Garden installation",
    description:
      "Turn part of your yard into a productive garden designed around your space, goals, and growing season.",
    items: [
      "Vegetable garden installation",
      "Raised garden beds",
      "Garden layout and design",
      "Soil preparation & planting",
      "Seasonal garden setup",
    ],
  },
] as const;

const refreshService = {
  title: "Property cleanup & refresh",
  description:
    "Bring overgrown, outdated, or neglected landscaping back to life without starting completely over.",
  items: [
    "Existing bed renovation",
    "Overgrown landscape cleanup",
    "Replacing dead or outdated plants",
    "Refreshing mulch or rock",
    "Improving curb appeal",
  ],
} as const;

const values = [
  "Reliable service and straightforward communication",
  "Practical recommendations for your property and budget",
  "One team for lawn care, landscaping, cleanups, and gardens",
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f4] text-[#1b1c19]">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#faf9f4]/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 lg:px-20">
          <a href="#top" className="flex items-center gap-3" aria-label="Yard To Table home">
            <Image
              src="/Yard to Table Logo.png"
              alt=""
              width={135}
              height={100}
              priority
              className="h-[4.5rem] w-auto object-contain"
            />
            <span className="font-display text-xl text-[#061b0e] sm:text-2xl">
              Yard To Table Landscaping
            </span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
            <HeaderLink href="#services">Services</HeaderLink>
            <HeaderLink href="#approach">Our Approach</HeaderLink>
            <a
              href="#request-service"
              className="rounded-full bg-[#061b0e] px-6 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#1b3022]"
            >
              Request Service
            </a>
          </nav>

          <details className="group relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full text-[#1b1c19] hover:bg-[#efeee9] [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open navigation</span>
              <MenuIcon />
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-14 flex w-56 flex-col gap-1 rounded-xl border border-[#e3e3de] bg-white p-3 shadow-xl"
            >
              <MobileLink href="#services">Services</MobileLink>
              <MobileLink href="#approach">Our Approach</MobileLink>
              <MobileLink href="#request-service">Request Service</MobileLink>
            </nav>
          </details>
        </div>
      </header>

      <main id="top" className="pt-20">
        <section className="relative flex min-h-[calc(90vh-5rem)] items-center overflow-hidden bg-[#efeee9]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Manicured residential garden with lawn, stone paths, and established plantings"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,249,244,0.97)_0%,rgba(250,249,244,0.84)_48%,rgba(250,249,244,0.08)_100%)]" />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 py-24 lg:px-20 lg:py-32">
            <div className="max-w-2xl">
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-12 bg-[#061b0e]" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#061b0e] sm:text-sm">
                  Residential landscaping • Noblesville & Westfield
                </p>
              </div>
              <h1 className="font-display text-5xl leading-[1.08] tracking-[-0.02em] text-[#1b1c19] sm:text-6xl lg:text-[64px] lg:leading-[72px]">
                Take care of your yard.
                <br />
                Build something better
                <br />
                with it.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-7 text-[#434843]">
                Yard To Table provides lawn maintenance, landscape care, installations, cleanups,
                and garden projects for homeowners in Noblesville, Westfield, and surrounding
                Hamilton County communities.
              </p>
              <a
                href="#request-service"
                className="mt-10 inline-flex rounded-full bg-[#061b0e] px-8 py-4 text-sm font-semibold uppercase tracking-[0.05em] text-white shadow-lg shadow-[#061b0e]/10 transition-colors hover:bg-[#1b3022]"
              >
                Request an Estimate
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-20 bg-[#faf9f4] py-20 lg:py-[120px]">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-20">
            <div className="mb-14 max-w-3xl lg:mb-16">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#061b0e]">
                Services
              </p>
              <h2 className="font-display text-4xl leading-tight text-[#1b1c19] sm:text-5xl sm:leading-[1.15]">
                From weekly mowing to a completely refreshed landscape.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-7 text-[#434843]">
                Whether you need dependable weekly maintenance, help cleaning up an existing
                landscape, or want to build something new, Yard To Table can take care of the
                property from the lawn to the garden.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
              <article className="group relative overflow-hidden rounded-lg bg-[#f5f4ef] p-8 transition-colors duration-300 hover:bg-[#efeee9] lg:col-span-2">
                <CardAccent />
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="font-display text-2xl leading-8">{refreshService.title}</h3>
                    <p className="mt-3 leading-6 text-[#434843]">{refreshService.description}</p>
                  </div>
                  <ServiceList items={refreshService.items} />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-20 bg-[#f5f4ef] py-20 lg:py-[120px]">
          <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 lg:grid-cols-2 lg:gap-16 lg:px-20">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#061b0e]">
                Our approach
              </p>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                Start with the property. Build from there.
              </h2>
              <p className="mt-8 text-lg leading-7 text-[#434843]">
                Every property is different. We start by understanding what you want from your yard,
                what needs attention today, and how much maintenance you want going forward. Then we
                recommend practical improvements that make sense for the property.
              </p>
              <div className="mt-12 space-y-7">
                {values.map((value, index) => (
                  <div key={value} className="flex items-start gap-6">
                    <span
                      className={`mt-1 h-12 w-1 shrink-0 bg-[#061b0e] ${
                        index === 1 ? "opacity-30" : index === 2 ? "opacity-10" : ""
                      }`}
                      aria-hidden="true"
                    />
                    <p className="font-display text-2xl leading-8">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative h-[420px] overflow-hidden rounded-xl bg-cover bg-center shadow-2xl shadow-[#061b0e]/5 sm:h-[520px] lg:h-[600px]"
              style={{ backgroundImage: `url(${approachImage})` }}
              role="img"
              aria-label="Flagstone path winding through a lush garden bed"
            >
              <div className="absolute inset-0 bg-[#061b0e]/10 mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section
          id="request-service"
          className="scroll-mt-20 overflow-hidden bg-[#061b0e] py-20 lg:py-[120px]"
        >
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 lg:grid-cols-12 lg:gap-6 lg:px-20">
            <div className="lg:col-span-5 lg:pt-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#d0e9d4]">
                Get started
              </p>
              <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Tell us what you&apos;d like to do with your yard.
              </h2>
              <p className="mt-6 text-lg leading-7 text-[#b4cdb8]">
                Choose the services you&apos;re interested in and tell us a little about your
                property. We&apos;ll review your request and follow up to discuss the work, answer
                questions, and determine the next step.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <TrellisIntakeEmbed />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#efeee9] py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 md:grid-cols-2 lg:px-20">
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-[#061b0e]">Yard To Table</h2>
            <p className="text-[#434843]">Better lawns. Better landscapes. More useful yards.</p>
          </div>
          <div className="space-y-2 text-sm font-semibold text-[#434843] md:text-right">
            <p>© 2026 Yard To Table Landscaping. All rights reserved.</p>
            <p>Crafting nature with intention.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-semibold uppercase tracking-[0.05em] text-[#434843] transition-colors hover:text-[#1b1c19]"
    >
      {children}
    </a>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-[#434843] hover:bg-[#f5f4ef] hover:text-[#061b0e]"
    >
      {children}
    </a>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-lg bg-[#f5f4ef] p-8 transition-colors duration-300 hover:bg-[#efeee9]">
      <CardAccent />
      <h3 className="font-display text-2xl leading-8">{service.title}</h3>
      <p className="mt-3 min-h-18 leading-6 text-[#434843]">{service.description}</p>
      <div className="mt-8">
        <ServiceList items={service.items} />
      </div>
    </article>
  );
}

function CardAccent() {
  return (
    <span
      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#061b0e] transition-transform duration-500 group-hover:scale-x-100"
      aria-hidden="true"
    />
  );
}

function ServiceList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 text-[#434843]">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckIcon />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0 fill-none stroke-[#061b0e] stroke-2"
    >
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 fill-none stroke-current stroke-2"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
