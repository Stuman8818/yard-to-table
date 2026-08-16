import Image from "next/image";

import { TrellisIntakeEmbed } from "../components/TrellisIntakeEmbed";

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
      "Weeding",
      "Shrub trimming",
      "Spring cleanup",
      "Fall cleanup",
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
      "Shrubs",
      "Small ornamental plants",
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
      "Soil preparation",
      "Planting",
      "Seasonal garden setup",
    ],
  },
  {
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
  },
] as const;

const values = [
  "Reliable service and straightforward communication",
  "Practical recommendations for your property and budget",
  "One team for lawn care, landscaping, cleanups, and gardens",
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#1e2923]">
      <header className="border-b border-white/15 bg-[#173f32] text-white">
        <div className="mx-auto flex min-h-28 max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:min-h-32 sm:gap-6 sm:px-8">
          <a href="#top" className="flex shrink-0 items-center" aria-label="Yard To Table home">
            <Image
              src="/Yard to Table Logo.png"
              alt=""
              width={104}
              height={104}
              priority
              className="h-[4.75rem] w-[4.75rem] rounded-xl bg-[#f8f5ec] object-contain shadow-sm sm:h-24 sm:w-24"
            />
          </a>
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-4 whitespace-nowrap text-sm font-medium text-[#e1e9e3] sm:gap-7 sm:text-base lg:text-lg"
          >
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#approach" className="hidden hover:text-white md:inline">
              Our approach
            </a>
            <a href="#request-service" className="hover:text-white">
              Request service
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="border-b border-[#c7d3c3] bg-[#dfe8d8] text-[#173f32]">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#476654]">
              Residential landscaping • Noblesville & Westfield
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-7xl">
              Take care of your yard. Build something better with it.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#46594d]">
              Yard To Table provides lawn maintenance, landscape care, installations, cleanups, and
              garden projects for homeowners in Noblesville, Westfield, and surrounding Hamilton
              County communities.
            </p>
            <a
              href="#request-service"
              className="mt-9 inline-flex rounded-lg bg-[#173f32] px-5 py-3 font-semibold text-white hover:bg-[#214d3c]"
            >
              Request an Estimate
            </a>
          </div>
        </section>

        <section id="services" className="scroll-mt-8 bg-[#edf2e9]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">Services</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              From weekly mowing to a completely refreshed landscape.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#59665e]">
              Whether you need dependable weekly maintenance, help cleaning up an existing
              landscape, or want to build something new, Yard To Table can take care of the property
              from the lawn to the garden.
            </p>
            <div className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-xl border border-[#d5ded2] bg-white p-7 shadow-[0_10px_30px_rgba(32,59,49,0.04)]"
                >
                  <div className="mb-6 h-1 w-10 rounded-full bg-[#78957e]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#607067]">{service.description}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-[#e2e7df] pt-5 text-sm text-[#405247]">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#78957e]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-8 bg-[#fbfaf6]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">
                Our approach
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Start with the property. Build from there.
              </h2>
              <p className="mt-6 leading-7 text-[#59665e]">
                Every property is different. We start by understanding what you want from your yard,
                what needs attention today, and how much maintenance you want going forward. Then we
                recommend practical improvements that make sense for the property.
              </p>
            </div>
            <ul className="space-y-4">
              {values.map((value) => (
                <li
                  key={value}
                  className="border-t border-[#d8dfd5] pt-4 text-lg font-medium text-[#33473b]"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="request-service" className="scroll-mt-8 bg-[#e8eee5]">
          <div className="mx-auto max-w-6xl px-3 py-20 sm:px-8 sm:py-28">
            <div className="px-3 sm:px-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">
                Get started
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Tell us what you&apos;d like to do with your yard.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#59665e]">
                Choose the services you&apos;re interested in and tell us a little about your
                property. We&apos;ll review your request and follow up to discuss the work, answer
                questions, and determine the next step.
              </p>
            </div>
            <div className="mt-10">
              <TrellisIntakeEmbed />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8ddd5] bg-[#eef0e9]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm sm:px-8">
          <p className="font-semibold">Yard To Table Landscaping</p>
          <p className="text-[#647068]">Better lawns. Better landscapes. More useful yards.</p>
          <p className="mt-4 text-xs text-[#79837d]">
            © 2026 Yard To Table Landscaping. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
